/**
 * Script para arreglar la tabla de Supabase desde la consola del navegador
 * Cópialo y pégalo en la consola de desarrollador del navegador
 */

async function fixSupabaseTable() {
    console.log('🔧 === FIXING SUPABASE TABLE STRUCTURE ===');
    
    const client = supabase || window.supabase_client;
    if (!client) {
        console.error('❌ No Supabase client available');
        return;
    }
    
    try {
        // 1. Verificar estructura actual
        console.log('📋 Checking current table structure...');
        const { data: currentData, error: currentError } = await client
            .from('purchases')
            .select('*')
            .limit(1);
        
        if (currentError) {
            console.error('❌ Error checking table:', currentError);
            return;
        }
        
        console.log('✅ Current table structure (sample record):', currentData[0]);
        
        // 2. Intentar insertar un registro con la estructura mínima
        console.log('🧪 Testing minimal insert...');
        const testData = {
            name: 'TEST_FIX_' + Date.now(),
            email: 'test-fix@example.com',
            paypal_transaction_id: 'FIX_TEST_' + Date.now(),
            purchase_date: new Date().toISOString(),
            book_sent: false
        };
        
        const { data: insertData, error: insertError } = await client
            .from('purchases')
            .insert([testData])
            .select();
        
        if (insertError) {
            console.error('❌ Minimal insert failed:', insertError);
        } else {
            console.log('✅ Minimal insert successful:', insertData[0]);
            console.log('✅ Table is working with basic structure');
        }
        
        // 3. Limpiar el registro de prueba
        if (insertData && insertData[0]) {
            await client
                .from('purchases')
                .delete()
                .eq('id', insertData[0].id);
            console.log('🧹 Test record cleaned up');
        }
        
        console.log('🎉 Table structure verification complete!');
        
    } catch (error) {
        console.error('❌ Fix script failed:', error);
    }
}

// Hacer la función disponible globalmente
window.fixSupabaseTable = fixSupabaseTable;

console.log('🔧 Table fix script loaded. Run: fixSupabaseTable()');
