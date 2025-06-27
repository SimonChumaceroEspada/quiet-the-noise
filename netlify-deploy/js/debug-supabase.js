/**
 * Debug Tools para verificar el estado del sistema
 */

// Función para verificar el estado de Supabase
async function debugSupabaseConnection() {
    console.log('🔍 === DEBUGGING SUPABASE CONNECTION ===');
    
    // 1. Verificar si Supabase library está cargada
    console.log('1. Supabase library loaded:', typeof window.supabase !== 'undefined');
    
    // 2. Verificar si supabase está inicializado
    console.log('2. Supabase instance exists:', typeof supabase !== 'undefined');
    
    // 3. Verificar configuración
    console.log('3. Config URL:', CONFIG.SUPABASE_URL);
    console.log('4. Config Key (first 20 chars):', CONFIG.SUPABASE_ANON_KEY?.substring(0, 20) + '...');
    
    // 4. Intentar inicializar si no existe
    if (typeof supabase === 'undefined' && typeof window.supabase !== 'undefined') {
        console.log('5. Attempting to initialize Supabase...');
        try {
            window.supabase_client = window.supabase.createClient(
                CONFIG.SUPABASE_URL,
                CONFIG.SUPABASE_ANON_KEY
            );
            console.log('✅ Supabase initialized successfully');
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
            return false;
        }
    }
    
    // 5. Intentar una consulta simple
    try {
        const client = supabase || window.supabase_client;
        if (client) {
            console.log('6. Testing connection...');
            const { data, error } = await client
                .from('purchases')
                .select('id')
                .limit(1);
            
            if (error) {
                console.error('❌ Supabase query error:', error);
                return false;
            } else {
                console.log('✅ Supabase connection working. Sample data:', data);
                return true;
            }
        } else {
            console.error('❌ No Supabase client available');
            return false;
        }
    } catch (error) {
        console.error('❌ Supabase test query failed:', error);
        return false;
    }
}

// Función para probar el guardado de datos
async function debugSavePurchase() {
    console.log('🔍 === DEBUGGING PURCHASE SAVE ===');
    
    const testData = {
        name: 'Debug Test User',
        email: 'debug@test.com',
        transactionId: 'DEBUG_' + Date.now(),
        paymentMethod: 'debug'
    };
    
    console.log('Test data:', testData);
    
    try {
        // Usar la función existente o crear una nueva
        const client = supabase || window.supabase_client;
        if (!client) {
            console.error('❌ No Supabase client available');
            return false;
        }
        
        const { data, error } = await client
            .from('purchases')
            .insert([
                {
                    name: testData.name,
                    email: testData.email,
                    paypal_transaction_id: testData.transactionId,
                    purchase_date: new Date().toISOString(),
                    book_sent: false
                }
            ])
            .select();
        
        if (error) {
            console.error('❌ Insert error:', error);
            return false;
        } else {
            console.log('✅ Test purchase saved successfully:', data);
            return data[0];
        }
    } catch (error) {
        console.error('❌ Save test failed:', error);
        return false;
    }
}

// Función para listar todas las compras
async function debugListPurchases() {
    console.log('🔍 === DEBUGGING LIST PURCHASES ===');
    
    try {
        const client = supabase || window.supabase_client;
        if (!client) {
            console.error('❌ No Supabase client available');
            return;
        }
        
        const { data, error } = await client
            .from('purchases')
            .select('*')
            .order('purchase_date', { ascending: false })
            .limit(10);
        
        if (error) {
            console.error('❌ List error:', error);
        } else {
            console.log('✅ Recent purchases:', data);
            console.log(`Total found: ${data.length}`);
        }
    } catch (error) {
        console.error('❌ List purchases failed:', error);
    }
}

// Función para verificar la tabla
async function debugCheckTable() {
    console.log('🔍 === DEBUGGING TABLE STRUCTURE ===');
    
    try {
        const client = supabase || window.supabase_client;
        if (!client) {
            console.error('❌ No Supabase client available');
            return;
        }
        
        // Intentar obtener la estructura con una consulta vacía
        const { data, error } = await client
            .from('purchases')
            .select('*')
            .limit(0);
        
        if (error) {
            console.error('❌ Table structure error:', error);
            console.log('🔧 Possible solutions:');
            console.log('1. Check if the "purchases" table exists in Supabase');
            console.log('2. Verify RLS (Row Level Security) policies');
            console.log('3. Check anon key permissions');
        } else {
            console.log('✅ Table structure accessible');
        }
    } catch (error) {
        console.error('❌ Table check failed:', error);
    }
}

// Función principal de debug
async function runFullDebug() {
    console.log('🚀 === STARTING FULL DEBUG SESSION ===');
    
    const connectionOk = await debugSupabaseConnection();
    if (!connectionOk) {
        console.log('❌ Stopping debug - connection failed');
        return;
    }
    
    await debugCheckTable();
    await debugListPurchases();
    
    // Opcionalmente probar guardado
    if (confirm('¿Quieres probar guardar un registro de debug?')) {
        const testResult = await debugSavePurchase();
        if (testResult) {
            console.log('✅ Debug save successful, ID:', testResult.id);
        }
    }
    
    console.log('🏁 === DEBUG SESSION COMPLETE ===');
}

// Hacer las funciones disponibles globalmente
window.debugSupabaseConnection = debugSupabaseConnection;
window.debugSavePurchase = debugSavePurchase;
window.debugListPurchases = debugListPurchases;
window.debugCheckTable = debugCheckTable;
window.runFullDebug = runFullDebug;

// Auto-run basic debug when script loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔍 Auto-running Supabase debug...');
        debugSupabaseConnection();
    }, 2000);
});
