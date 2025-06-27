/**
 * PayPal Debug Tools
 * Para debuggear problemas con la integración de PayPal
 */

// Variable global para trackear callbacks de PayPal
window.paypalDebugInfo = {
    callbacksTriggered: [],
    lastPaymentData: null,
    initializationStatus: 'not_started'
};

// Override console.log para capturar logs de PayPal
const originalConsoleLog = console.log;
console.log = function(...args) {
    // Capturar logs relacionados con PayPal
    const message = args.join(' ');
    if (message.includes('PayPal') || message.includes('paypal')) {
        window.paypalDebugInfo.callbacksTriggered.push({
            timestamp: new Date().toISOString(),
            message: message,
            args: args
        });
    }
    originalConsoleLog.apply(console, args);
};

// Función para verificar el estado de PayPal
function debugPayPalIntegration() {
    console.log('🔍 === DEBUGGING PAYPAL INTEGRATION ===');
    
    // 1. Verificar si PayPal está cargado
    console.log('1. PayPal library loaded:', typeof paypal !== 'undefined');
    
    // 2. Verificar si los botones están renderizados
    const paypalContainer = document.getElementById('paypal-container-DG2V4FLX49RM8');
    console.log('2. PayPal container exists:', !!paypalContainer);
    console.log('3. PayPal container content:', paypalContainer?.innerHTML?.substring(0, 100) + '...');
    
    // 3. Verificar callbacks
    console.log('4. onPayPalSuccess defined:', typeof window.onPayPalSuccess === 'function');
    console.log('5. onPayPalError defined:', typeof window.onPayPalError === 'function');
    console.log('6. onPayPalCancel defined:', typeof window.onPayPalCancel === 'function');
    
    // 4. Verificar funciones de procesamiento
    console.log('7. processPayPalPurchase defined:', typeof processPayPalPurchase === 'function');
    console.log('8. handleSuccessfulPurchase defined:', typeof handleSuccessfulPurchase === 'function');
    
    // 5. Mostrar historial de callbacks
    console.log('9. PayPal callbacks triggered:', window.paypalDebugInfo.callbacksTriggered.length);
    if (window.paypalDebugInfo.callbacksTriggered.length > 0) {
        console.log('   Recent callbacks:', window.paypalDebugInfo.callbacksTriggered.slice(-5));
    }
    
    // 6. Verificar parámetros URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log('10. URL parameters:', Object.fromEntries(urlParams));
    
    console.log('🔍 PayPal debug complete');
}

// Función para simular un pago exitoso de PayPal
function simulatePayPalSuccess() {
    console.log('🧪 Simulating PayPal success callback...');
    
    const mockDetails = {
        id: 'SIMULATED_' + Date.now(),
        payer: {
            name: {
                given_name: 'Test',
                surname: 'Customer'
            },
            email_address: 'testcustomer@paypal.com'
        },
        status: 'COMPLETED'
    };
    
    const mockData = {
        orderID: 'SIMULATED_ORDER_' + Date.now()
    };
    
    console.log('Mock PayPal Details:', mockDetails);
    console.log('Mock PayPal Data:', mockData);
    
    if (typeof window.onPayPalSuccess === 'function') {
        window.onPayPalSuccess(mockDetails, mockData);
    } else {
        console.error('❌ onPayPalSuccess function not found!');
    }
}

// Función para verificar la configuración actual de PayPal
function checkPayPalConfiguration() {
    console.log('⚙️ === CHECKING PAYPAL CONFIGURATION ===');
    
    // Verificar el script de PayPal cargado
    const paypalScripts = document.querySelectorAll('script[src*="paypal"]');
    console.log('PayPal scripts loaded:', paypalScripts.length);
    paypalScripts.forEach((script, index) => {
        console.log(`  Script ${index + 1}:`, script.src);
    });
    
    // Verificar si paypal global está disponible
    if (typeof paypal !== 'undefined') {
        console.log('✅ PayPal global object available');
        console.log('PayPal version:', paypal.version || 'unknown');
        console.log('PayPal Buttons available:', typeof paypal.Buttons === 'function');
    } else {
        console.log('❌ PayPal global object not available');
    }
    
    console.log('⚙️ Configuration check complete');
}

// Función para forzar el renderizado de botones PayPal
function forceRenderPayPalButtons() {
    console.log('🔄 Force rendering PayPal buttons...');
    
    const container = document.getElementById('paypal-container-DG2V4FLX49RM8');
    if (!container) {
        console.error('❌ PayPal container not found');
        return;
    }
    
    if (typeof paypal === 'undefined' || typeof paypal.Buttons !== 'function') {
        console.error('❌ PayPal Buttons not available');
        return;
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Renderizar botones con callbacks mejorados
    paypal.Buttons({
        createOrder: function(data, actions) {
            console.log('🛒 PayPal createOrder called');
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '1',
                        currency_code: 'USD'
                    },
                    description: 'Quiet the Noise: 30 Days to Mental Clarity eBook'
                }]
            });
        },
        onApprove: function(data, actions) {
            console.log('✅ PayPal onApprove called with data:', data);
            return actions.order.capture().then(function(details) {
                console.log('💰 PayPal order captured, details:', details);
                
                // Guardar para debugging
                window.paypalDebugInfo.lastPaymentData = { details, data };
                
                // Llamar al callback personalizado
                if (typeof window.onPayPalSuccess === 'function') {
                    window.onPayPalSuccess(details, data);
                } else {
                    console.error('❌ onPayPalSuccess callback not found!');
                }
            });
        },
        onError: function(err) {
            console.error('❌ PayPal onError called:', err);
            window.paypalDebugInfo.callbacksTriggered.push({
                timestamp: new Date().toISOString(),
                type: 'error',
                data: err
            });
            
            if (typeof window.onPayPalError === 'function') {
                window.onPayPalError(err);
            }
        },
        onCancel: function(data) {
            console.log('❌ PayPal onCancel called:', data);
            window.paypalDebugInfo.callbacksTriggered.push({
                timestamp: new Date().toISOString(),
                type: 'cancel',
                data: data
            });
            
            if (typeof window.onPayPalCancel === 'function') {
                window.onPayPalCancel(data);
            }
        }
    }).render('#paypal-container-DG2V4FLX49RM8').then(function() {
        console.log('✅ PayPal buttons rendered successfully');
        window.paypalDebugInfo.initializationStatus = 'success';
    }).catch(function(err) {
        console.error('❌ PayPal button render failed:', err);
        window.paypalDebugInfo.initializationStatus = 'failed';
    });
}

// Hacer funciones disponibles globalmente
window.debugPayPalIntegration = debugPayPalIntegration;
window.simulatePayPalSuccess = simulatePayPalSuccess;
window.checkPayPalConfiguration = checkPayPalConfiguration;
window.forceRenderPayPalButtons = forceRenderPayPalButtons;

// Auto-debug cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔍 Auto-running PayPal debug...');
        debugPayPalIntegration();
    }, 3000); // Esperar 3 segundos para que PayPal se cargue
});

console.log('🔧 PayPal debug tools loaded');
