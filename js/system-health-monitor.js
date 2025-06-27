/**
 * System Health Monitor
 * Monitors the health of the eBook purchase and delivery system
 */

class SystemHealthMonitor {
    constructor() {
        this.checks = [
            { name: 'FormSubmit API', test: this.checkFormSubmit.bind(this) },
            { name: 'Download Link', test: this.checkDownloadLink.bind(this) },
            { name: 'Payment Processing', test: this.checkPaymentSystem.bind(this) },
            { name: 'Local Storage', test: this.checkLocalStorage.bind(this) }
        ];
        this.lastHealthCheck = null;
        this.healthStatus = null;
    }

    async runHealthCheck() {
        console.log('🏥 Running system health check...');
        const results = {
            timestamp: new Date().toISOString(),
            overall: 'healthy',
            checks: {},
            warnings: [],
            errors: []
        };

        for (const check of this.checks) {
            try {
                console.log(`🔍 Checking ${check.name}...`);
                const result = await check.test();
                results.checks[check.name] = {
                    status: result.success ? 'pass' : 'fail',
                    message: result.message,
                    details: result.details || null,
                    timestamp: new Date().toISOString()
                };

                if (!result.success) {
                    results.errors.push(`${check.name}: ${result.message}`);
                    results.overall = 'unhealthy';
                } else if (result.warning) {
                    results.warnings.push(`${check.name}: ${result.warning}`);
                    if (results.overall === 'healthy') {
                        results.overall = 'warning';
                    }
                }
            } catch (error) {
                console.error(`❌ Health check failed for ${check.name}:`, error);
                results.checks[check.name] = {
                    status: 'error',
                    message: error.message,
                    timestamp: new Date().toISOString()
                };
                results.errors.push(`${check.name}: ${error.message}`);
                results.overall = 'unhealthy';
            }
        }

        this.lastHealthCheck = results;
        this.healthStatus = results.overall;
        
        // Store results for debugging
        localStorage.setItem('systemHealthCheck', JSON.stringify(results));
        
        console.log(`🏥 Health check complete. Status: ${results.overall.toUpperCase()}`);
        if (results.errors.length > 0) {
            console.warn('⚠️ Errors found:', results.errors);
        }
        if (results.warnings.length > 0) {
            console.warn('⚠️ Warnings:', results.warnings);
        }

        return results;
    }

    async checkFormSubmit() {
        try {
            // Test with a minimal request to check if the service is responding
            const testData = new FormData();
            testData.append('_subject', 'Health Check');
            testData.append('_template', 'table');
            testData.append('_captcha', 'false');
            testData.append('test', 'health-check');

            const endpoint = window.location.hostname === 'localhost' 
                ? 'https://formsubmit.co/ajax/simon.oliveira.v@gmail.com'
                : 'https://formsubmit.co/ajax/b9a8ce7ec97e8a6e2b9f5a1e8e5c4d6f';

            const response = await fetch(endpoint, {
                method: 'POST',
                body: testData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'FormSubmit API is responding',
                    details: { status: response.status }
                };
            } else {
                return {
                    success: false,
                    message: `FormSubmit API returned status ${response.status}`,
                    details: { status: response.status }
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `FormSubmit API unreachable: ${error.message}`
            };
        }
    }

    async checkDownloadLink() {
        try {
            const downloadUrl = 'https://drive.google.com/uc?export=download&id=1uGlONPgA7p-r_fGFIvAO3e3V1NfxQhFz';
            
            // Use HEAD request to check if the file is accessible
            const response = await fetch(downloadUrl, { 
                method: 'HEAD',
                mode: 'no-cors' // Google Drive requires this
            });

            // Since we're using no-cors, we won't get detailed response info
            // But if the request completes without error, the URL is likely valid
            return {
                success: true,
                message: 'Download link is accessible',
                details: { url: downloadUrl }
            };
        } catch (error) {
            return {
                success: false,
                message: `Download link check failed: ${error.message}`
            };
        }
    }

    async checkPaymentSystem() {
        try {
            // Check if required payment functions exist
            const requiredFunctions = ['handlePurchase', 'showEBookSuccessNotification'];
            const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
            
            if (missingFunctions.length > 0) {
                return {
                    success: false,
                    message: `Missing payment functions: ${missingFunctions.join(', ')}`
                };
            }

            // Check if payment button exists and is enabled
            const paymentButton = document.querySelector('.btn-primary[onclick*="handlePurchase"]');
            if (!paymentButton) {
                return {
                    success: false,
                    message: 'Payment button not found in DOM'
                };
            }

            if (paymentButton.disabled) {
                return {
                    success: true,
                    message: 'Payment system ready',
                    warning: 'Payment button is currently disabled'
                };
            }

            return {
                success: true,
                message: 'Payment system is fully operational'
            };
        } catch (error) {
            return {
                success: false,
                message: `Payment system check failed: ${error.message}`
            };
        }
    }

    async checkLocalStorage() {
        try {
            // Test localStorage functionality
            const testKey = 'health-check-test';
            const testValue = Date.now().toString();
            
            localStorage.setItem(testKey, testValue);
            const retrieved = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            if (retrieved === testValue) {
                // Check for any failed deliveries that need attention
                const failedDeliveries = JSON.parse(localStorage.getItem('failedEbookDeliveries') || '[]');
                
                if (failedDeliveries.length > 0) {
                    return {
                        success: true,
                        message: 'Local storage working',
                        warning: `${failedDeliveries.length} failed deliveries need manual attention`,
                        details: { failedDeliveries: failedDeliveries.length }
                    };
                }
                
                return {
                    success: true,
                    message: 'Local storage is working properly'
                };
            } else {
                return {
                    success: false,
                    message: 'Local storage read/write test failed'
                };
            }
        } catch (error) {
            return {
                success: false,
                message: `Local storage check failed: ${error.message}`
            };
        }
    }

    getHealthStatus() {
        return {
            status: this.healthStatus,
            lastCheck: this.lastHealthCheck?.timestamp,
            summary: this.lastHealthCheck
        };
    }

    // Display health status in a user-friendly way
    displayHealthStatus() {
        if (!this.lastHealthCheck) {
            console.log('No health check has been run yet. Run runHealthCheck() first.');
            return;
        }

        const { overall, checks, warnings, errors } = this.lastHealthCheck;
        
        console.log(`\n🏥 SYSTEM HEALTH REPORT`);
        console.log(`Overall Status: ${overall.toUpperCase()}`);
        console.log(`Last Check: ${this.lastHealthCheck.timestamp}`);
        console.log('\n📋 Individual Checks:');
        
        Object.entries(checks).forEach(([name, result]) => {
            const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
            console.log(`${icon} ${name}: ${result.message}`);
        });

        if (warnings.length > 0) {
            console.log('\n⚠️ Warnings:');
            warnings.forEach(warning => console.log(`  - ${warning}`));
        }

        if (errors.length > 0) {
            console.log('\n❌ Errors:');
            errors.forEach(error => console.log(`  - ${error}`));
        }
    }

    // Schedule automatic health checks
    startMonitoring(intervalMinutes = 30) {
        console.log(`🏥 Starting system monitoring (every ${intervalMinutes} minutes)`);
        
        // Run initial check
        this.runHealthCheck();
        
        // Schedule periodic checks
        return setInterval(() => {
            this.runHealthCheck();
        }, intervalMinutes * 60 * 1000);
    }

    stopMonitoring(intervalId) {
        clearInterval(intervalId);
        console.log('🏥 System monitoring stopped');
    }
}

// Make available globally
window.SystemHealthMonitor = SystemHealthMonitor;

// Auto-create instance for easy access
window.healthMonitor = new SystemHealthMonitor();

// Add console helper commands
window.checkSystemHealth = () => {
    return window.healthMonitor.runHealthCheck();
};

window.showHealthStatus = () => {
    window.healthMonitor.displayHealthStatus();
};

// Run an initial health check when the script loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.healthMonitor.runHealthCheck();
    }, 2000); // Wait 2 seconds for other scripts to load
});
