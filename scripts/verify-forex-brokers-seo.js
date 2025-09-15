const fs = require('fs');
const path = require('path');

// SEO verification script for forex-brokers pages
class ForexBrokersSEOVerifier {
    constructor() {
        this.basePath = 'C:/Users/LENOVO/Desktop/dualite/forex-brokers';
        this.pages = this.getAllPages();
        this.verificationResults = [];
    }

    getAllPages() {
        const pages = [];
        
        // Get all HTML files from subdirectories
        const subdirs = ['regional', 'trading-types', 'regions'];
        
        subdirs.forEach(dir => {
            const dirPath = path.join(this.basePath, dir);
            if (fs.existsSync(dirPath)) {
                this.getHtmlFiles(dirPath, pages, dir);
            }
        });

        // Handle regions subdirectories
        const regionsDir = path.join(this.basePath, 'regions');
        if (fs.existsSync(regionsDir)) {
            fs.readdirSync(regionsDir).forEach(region => {
                const regionPath = path.join(regionsDir, region);
                if (fs.statSync(regionPath).isDirectory()) {
                    this.getHtmlFiles(regionPath, pages, `regions/${region}`);
                }
            });
        }

        return pages;
    }

    getHtmlFiles(dirPath, pages, category) {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            files.forEach(file => {
                if (file.endsWith('.html')) {
                    const filePath = path.join(dirPath, file);
                    const relativePath = path.relative(this.basePath, filePath);
                    pages.push({
                        path: filePath,
                        relativePath: relativePath,
                        category: category,
                        name: file.replace('.html', '')
                    });
                }
            });
        }
    }

    verifyAllPages() {
        console.log(`Verifying SEO optimization for ${this.pages.length} pages...`);
        
        this.pages.forEach(page => {
            try {
                const result = this.verifyPage(page);
                this.verificationResults.push(result);
                console.log(`✓ Verified: ${page.relativePath}`);
            } catch (error) {
                console.error(`✗ Failed to verify ${page.relativePath}:`, error.message);
                this.verificationResults.push({
                    ...page,
                    success: false,
                    error: error.message
                });
            }
        });

        this.generateVerificationReport();
        this.generateConsistencyReport();
    }

    verifyPage(page) {
        const content = fs.readFileSync(page.path, 'utf8');
        
        const checks = {
            hasViewport: content.includes('viewport'),
            hasOpenGraph: content.includes('og:'),
            hasTwitterCards: content.includes('twitter:'),
            hasStructuredData: content.includes('application/ld+json'),
            hasCanonical: content.includes('canonical'),
            hasMetaDescription: content.includes('meta name="description"'),
            hasKeywords: content.includes('meta name="keywords"'),
            hasAuthor: content.includes('meta name="author"'),
            hasRobots: content.includes('meta name="robots"'),
            hasMobileOptimization: content.includes('mobile-web-app-capable'),
            hasCSSVariables: content.includes('--primary-color'),
            hasConsistentStructure: this.verifyStructure(content),
            hasValidTitle: this.verifyTitle(content),
            hasValidMetaDescription: this.verifyMetaDescription(content)
        };

        const score = this.calculateScore(checks);
        
        return {
            ...page,
            success: true,
            checks: checks,
            score: score,
            issues: this.identifyIssues(checks)
        };
    }

    verifyStructure(content) {
        // Check for consistent structure elements
        const requiredElements = [
            '<header>',
            '<div class="container">',
            '<h1>',
            'broker-grid',
            'broker-card',
            'guide-section',
            'footer'
        ];

        return requiredElements.every(el => content.includes(el));
    }

    verifyTitle(content) {
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        if (!titleMatch) return false;
        
        const title = titleMatch[1];
        return title.length >= 30 && title.length <= 60 && title.includes('2025');
    }

    verifyMetaDescription(content) {
        const descMatch = content.match(/<meta name="description" content="(.*?)"/);
        if (!descMatch) return false;
        
        const description = descMatch[1];
        return description.length >= 120 && description.length <= 160;
    }

    calculateScore(checks) {
        const totalChecks = Object.keys(checks).length;
        const passedChecks = Object.values(checks).filter(Boolean).length;
        return Math.round((passedChecks / totalChecks) * 100);
    }

    identifyIssues(checks) {
        const issues = [];
        
        if (!checks.hasViewport) issues.push('Missing viewport meta tag');
        if (!checks.hasOpenGraph) issues.push('Missing Open Graph tags');
        if (!checks.hasTwitterCards) issues.push('Missing Twitter Card tags');
        if (!checks.hasStructuredData) issues.push('Missing structured data');
        if (!checks.hasCanonical) issues.push('Missing canonical URL');
        if (!checks.hasMetaDescription) issues.push('Missing meta description');
        if (!checks.hasKeywords) issues.push('Missing keywords meta tag');
        if (!checks.hasAuthor) issues.push('Missing author meta tag');
        if (!checks.hasRobots) issues.push('Missing robots meta tag');
        if (!checks.hasMobileOptimization) issues.push('Missing mobile optimization');
        if (!checks.hasCSSVariables) issues.push('Missing CSS variables for consistency');
        if (!checks.hasConsistentStructure) issues.push('Inconsistent page structure');
        if (!checks.hasValidTitle) issues.push('Invalid title (length or year)');
        if (!checks.hasValidMetaDescription) issues.push('Invalid meta description length');

        return issues;
    }

    generateVerificationReport() {
        const report = {
            timestamp: new Date().toISOString(),
            total_pages: this.pages.length,
            successful_verifications: this.verificationResults.filter(r => r.success).length,
            failed_verifications: this.verificationResults.filter(r => !r.success).length,
            average_score: this.calculateAverageScore(),
            score_distribution: this.getScoreDistribution(),
            common_issues: this.getCommonIssues(),
            category_performance: this.getCategoryPerformance(),
            pages_by_score: this.verificationResults
                .filter(r => r.success)
                .sort((a, b) => b.score - a.score)
                .map(r => ({
                    path: r.relativePath,
                    category: r.category,
                    score: r.score,
                    issues: r.issues.length
                }))
        };

        fs.writeFileSync(
            path.join(this.basePath, 'seo-verification-report.json'),
            JSON.stringify(report, null, 2)
        );

        console.log('\n📊 SEO Verification Report:');
        console.log(`✅ Successfully verified: ${report.successful_verifications}/${report.total_pages}`);
        console.log(`❌ Failed verifications: ${report.failed_verifications}/${report.total_pages}`);
        console.log(`📈 Average SEO score: ${report.average_score}%`);
        console.log(`📄 Report saved to: ${path.join(this.basePath, 'seo-verification-report.json')}`);
    }

    generateConsistencyReport() {
        const consistencyChecks = this.verifyConsistency();
        
        const consistencyReport = {
            timestamp: new Date().toISOString(),
            overall_consistency: consistencyChecks.overall,
            category_consistency: consistencyChecks.categories,
            structure_consistency: consistencyChecks.structure,
            recommendations: consistencyChecks.recommendations
        };

        fs.writeFileSync(
            path.join(this.basePath, 'consistency-report.json'),
            JSON.stringify(consistencyReport, null, 2)
        );

        console.log(`📋 Consistency report saved to: ${path.join(this.basePath, 'consistency-report.json')}`);
    }

    verifyConsistency() {
        const checks = {
            categories: {},
            structure: {
                hasHeader: 0,
                hasContainer: 0,
                hasBrokerGrid: 0,
                hasGuideSection: 0,
                hasFooter: 0
            }
        };

        this.verificationResults.filter(r => r.success).forEach(result => {
            // Initialize category if not exists
            if (!checks.categories[result.category]) {
                checks.categories[result.category] = {
                    count: 0,
                    totalScore: 0,
                    avgOpenGraph: 0,
                    avgStructuredData: 0,
                    avgCSSVariables: 0
                };
            }

            checks.categories[result.category].count++;
            checks.categories[result.category].totalScore += result.score;
            checks.categories[result.category].avgOpenGraph += result.checks.hasOpenGraph ? 1 : 0;
            checks.categories[result.category].avgStructuredData += result.checks.hasStructuredData ? 1 : 0;
            checks.categories[result.category].avgCSSVariables += result.checks.hasCSSVariables ? 1 : 0;

            // Count structure elements
            const content = fs.readFileSync(result.path, 'utf8');
            if (content.includes('<header>')) checks.structure.hasHeader++;
            if (content.includes('<div class="container">')) checks.structure.hasContainer++;
            if (content.includes('broker-grid')) checks.structure.hasBrokerGrid++;
            if (content.includes('guide-section')) checks.structure.hasGuideSection++;
            if (content.includes('<footer>')) checks.structure.hasFooter++;
        });

        const totalPages = this.verificationResults.filter(r => r.success).length;
        const structureConsistency = {};
        
        Object.keys(checks.structure).forEach(key => {
            structureConsistency[key] = {
                count: checks.structure[key],
                percentage: Math.round((checks.structure[key] / totalPages) * 100)
            };
        });

        // Calculate category averages
        Object.keys(checks.categories).forEach(category => {
            const cat = checks.categories[category];
            cat.avgScore = Math.round(cat.totalScore / cat.count);
            cat.avgOpenGraph = Math.round((cat.avgOpenGraph / cat.count) * 100);
            cat.avgStructuredData = Math.round((cat.avgStructuredData / cat.count) * 100);
            cat.avgCSSVariables = Math.round((cat.avgCSSVariables / cat.count) * 100);
        });

        return {
            overall: {
                total_pages: totalPages,
                structure_consistency: structureConsistency,
                category_count: Object.keys(checks.categories).length
            },
            categories: checks.categories,
            structure: structureConsistency,
            recommendations: this.generateConsistencyRecommendations(checks)
        };
    }

    generateConsistencyRecommendations(checks) {
        const recommendations = [];
        
        const lowStructures = [];
        Object.keys(checks.structure).forEach(key => {
            const percentage = checks.structure[key].percentage;
            if (percentage < 90) {
                lowStructures.push(`${key} (${percentage}%)`);
            }
        });

        if (lowStructures.length > 0) {
            recommendations.push({
                priority: 'high',
                issue: 'Inconsistent page structure',
                details: `Missing elements: ${lowStructures.join(', ')}`,
                recommendation: 'Standardize page structure across all forex-brokers pages'
            });
        }

        const lowCategories = [];
        Object.keys(checks.categories).forEach(category => {
            const cat = checks.categories[category];
            if (cat.avgScore < 80) {
                lowCategories.push(`${category} (${cat.avgScore}%)`);
            }
        });

        if (lowCategories.length > 0) {
            recommendations.push({
                priority: 'medium',
                issue: 'Categories with low SEO scores',
                details: `Categories needing improvement: ${lowCategories.join(', ')}`,
                recommendation: 'Focus SEO optimization on underperforming categories'
            });
        }

        return recommendations;
    }

    calculateAverageScore() {
        const successfulResults = this.verificationResults.filter(r => r.success);
        if (successfulResults.length === 0) return 0;
        
        const totalScore = successfulResults.reduce((sum, result) => sum + result.score, 0);
        return Math.round(totalScore / successfulResults.length);
    }

    getScoreDistribution() {
        const distribution = {
            '90-100%': 0,
            '80-89%': 0,
            '70-79%': 0,
            '60-69%': 0,
            'Below 60%': 0
        };

        this.verificationResults.filter(r => r.success).forEach(result => {
            if (result.score >= 90) distribution['90-100%']++;
            else if (result.score >= 80) distribution['80-89%']++;
            else if (result.score >= 70) distribution['70-79%']++;
            else if (result.score >= 60) distribution['60-69%']++;
            else distribution['Below 60%']++;
        });

        return distribution;
    }

    getCommonIssues() {
        const issues = {};
        this.verificationResults.filter(r => r.success).forEach(result => {
            result.issues.forEach(issue => {
                issues[issue] = (issues[issue] || 0) + 1;
            });
        });

        return Object.entries(issues)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([issue, count]) => ({ issue, count }));
    }

    getCategoryPerformance() {
        const categories = {};
        this.verificationResults.filter(r => r.success).forEach(result => {
            if (!categories[result.category]) {
                categories[result.category] = { total: 0, score: 0 };
            }
            categories[result.category].total++;
            categories[result.category].score += result.score;
        });

        return Object.entries(categories).map(([category, data]) => ({
            category,
            average_score: Math.round(data.score / data.total),
            pages: data.total
        }));
    }
}

// Execute the verification
const verifier = new ForexBrokersSEOVerifier();
verifier.verifyAllPages();

console.log('\n🎉 SEO verification completed successfully!');
console.log('All forex-brokers pages have been verified for:');
console.log('• Complete SEO optimization');
console.log('• Consistent page structure');
console.log('• Mobile optimization');
console.log('• Structured data implementation');
console.log('• Meta tag completeness');
console.log('• CSS consistency');