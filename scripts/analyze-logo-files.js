require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Logo directory path
const logoDir = 'c:\\Users\\LENOVO\\Desktop\\dualite\\Broker reviews │ BrokerChooser';

// Function to extract broker name from filename
function extractBrokerName(filename) {
  // Remove file extension
  let name = filename.replace(/\.(png|jpg|jpeg|webp)$/i, '');
  
  // Remove common prefixes
  name = name.replace(/^imgi_\d+_/, '');
  
  // Remove common suffixes
  name = name.replace(/-review.*$/, '');
  name = name.replace(/-logo.*$/, '');
  name = name.replace(/\s+\(\d+\)$/, ''); // Remove (1), (2) etc.
  name = name.replace(/\s+110x40.*$/, ''); // Remove size indicators
  name = name.replace(/\s+transparent.*$/, ''); // Remove transparent indicators
  name = name.replace(/\s+small.*$/, ''); // Remove small indicators
  name = name.replace(/\s+new.*$/, ''); // Remove new indicators
  
  // Convert dashes and underscores to spaces
  name = name.replace(/[-_]/g, ' ');
  
  // Clean up multiple spaces
  name = name.replace(/\s+/g, ' ').trim();
  
  // Capitalize words
  name = name.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
  
  return name;
}

// Function to calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple word matching
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  
  let matchingWords = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 && word1.length > 2) {
        matchingWords++;
        break;
      }
    }
  }
  
  const totalWords = Math.max(words1.length, words2.length);
  return matchingWords / totalWords;
}

// Function to find best broker match
function findBestMatch(extractedName, brokers) {
  let bestMatch = null;
  let bestScore = 0;
  
  for (const broker of brokers) {
    // Check against broker name
    const nameScore = calculateSimilarity(extractedName, broker.name);
    
    // Check against slug (convert to readable name)
    const slugName = broker.slug.replace(/-/g, ' ').replace(/\s+year$/, '').trim();
    const slugScore = calculateSimilarity(extractedName, slugName);
    
    const maxScore = Math.max(nameScore, slugScore);
    
    if (maxScore > bestScore) {
      bestScore = maxScore;
      bestMatch = {
        broker,
        score: maxScore,
        matchType: nameScore > slugScore ? 'name' : 'slug'
      };
    }
  }
  
  return bestMatch;
}

async function analyzeLogoFiles() {
  try {
    console.log('Fetching brokers from database...');
    
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, slug')
      .order('name');

    if (error) {
      console.error('Error fetching brokers:', error);
      return;
    }

    console.log(`Found ${brokers.length} brokers in database`);
    console.log('\nAnalyzing logo files...');
    
    // Read logo directory
    const files = fs.readdirSync(logoDir)
      .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
      .sort();
    
    console.log(`Found ${files.length} logo files`);
    
    const matches = [];
    const unmatched = [];
    const duplicates = new Map();
    
    for (const file of files) {
      const extractedName = extractBrokerName(file);
      const bestMatch = findBestMatch(extractedName, brokers);
      
      if (bestMatch && bestMatch.score >= 0.6) {
        // Check for duplicates
        const brokerId = bestMatch.broker.id;
        if (duplicates.has(brokerId)) {
          duplicates.get(brokerId).push({
            file,
            extractedName,
            score: bestMatch.score
          });
        } else {
          duplicates.set(brokerId, [{
            file,
            extractedName,
            score: bestMatch.score
          }]);
          
          matches.push({
            file,
            extractedName,
            broker: bestMatch.broker,
            score: bestMatch.score,
            matchType: bestMatch.matchType
          });
        }
      } else {
        unmatched.push({
          file,
          extractedName,
          bestMatch: bestMatch ? {
            broker: bestMatch.broker.name,
            score: bestMatch.score
          } : null
        });
      }
    }
    
    // Display results
    console.log('\n=== SUCCESSFUL MATCHES ===');
    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.file}`);
      console.log(`   Extracted: "${match.extractedName}"`);
      console.log(`   Matched: "${match.broker.name}" (${match.score.toFixed(2)} confidence)`);
      console.log(`   Match type: ${match.matchType}`);
      console.log('');
    });
    
    console.log('\n=== DUPLICATE MATCHES ===');
    for (const [brokerId, files] of duplicates) {
      if (files.length > 1) {
        const broker = brokers.find(b => b.id === brokerId);
        console.log(`Broker: ${broker.name}`);
        files.forEach(file => {
          console.log(`  - ${file.file} (${file.score.toFixed(2)})`);
        });
        console.log('');
      }
    }
    
    console.log('\n=== UNMATCHED FILES ===');
    unmatched.forEach((item, index) => {
      console.log(`${index + 1}. ${item.file}`);
      console.log(`   Extracted: "${item.extractedName}"`);
      if (item.bestMatch) {
        console.log(`   Best guess: "${item.bestMatch.broker}" (${item.bestMatch.score.toFixed(2)})`);
      }
      console.log('');
    });
    
    console.log('\n=== SUMMARY ===');
    console.log(`Total logo files: ${files.length}`);
    console.log(`Successful matches: ${matches.length}`);
    console.log(`Unmatched files: ${unmatched.length}`);
    console.log(`Brokers with logos: ${matches.length}`);
    console.log(`Brokers without logos: ${brokers.length - matches.length}`);
    
    // Find brokers without logos
    const matchedBrokerIds = new Set(matches.map(m => m.broker.id));
    const brokersWithoutLogos = brokers.filter(b => !matchedBrokerIds.has(b.id));
    
    if (brokersWithoutLogos.length > 0) {
      console.log('\n=== BROKERS WITHOUT LOGOS ===');
      brokersWithoutLogos.forEach((broker, index) => {
        console.log(`${index + 1}. ${broker.name} (slug: ${broker.slug})`);
      });
    }
    
    return { matches, unmatched, brokersWithoutLogos };
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

analyzeLogoFiles();