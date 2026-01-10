
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Simple .env parser since we can't install dotenv easily
function loadEnv() {
    try {
        const envPath = path.resolve('.env.local');
        if (!fs.existsSync(envPath)) return;

        const content = fs.readFileSync(envPath, 'utf8');
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                process.env[match[1].trim()] = value;
            }
        });
    } catch (e) {
        console.error("Error loading .env.local:", e);
    }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
    console.log("Checking Supabase connection...");

    // 1. Check Profiles Table
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

    if (profileError) {
        console.error("❌ 'profiles' table check failed:", profileError.message);
    } else {
        console.log("✅ 'profiles' table exists.");
    }

    // 2. Check Generations Table
    const { data: generations, error: genError } = await supabase
        .from('generations')
        .select('count')
        .limit(1);

    if (genError) {
        console.error("❌ 'generations' table check failed:", genError.message);
    } else {
        console.log("✅ 'generations' table exists.");
    }

    // 3. Check RPC 'decrement_credits'
    // We expect an error because we might not provide arguments, but the error type tells us existence
    // or we can try to call it with a fake ID.
    const { error: rpcError } = await supabase.rpc('decrement_credits', { user_id: '00000000-0000-0000-0000-000000000000' });

    // If function is missing, error code is usually PGRST202 or similar "function not found"
    if (rpcError) {
        if (rpcError.message.includes("Could not find the function") || rpcError.code === "PGRST202") {
            console.error("❌ RPC function 'decrement_credits' MISSING.");
        } else {
            console.log("✅ RPC function 'decrement_credits' likely exists (" + rpcError.message + ")");
        }
    } else {
        console.log("✅ RPC function 'decrement_credits' exists.");
    }

    // 4. Check RPC 'update_subscription'
    const { error: rpcUpdateError } = await supabase.rpc('update_subscription', {
        p_user_id: '00000000-0000-0000-0000-000000000000',
        p_status: 'test',
        p_credits: 0,
        p_customer_id: 'test'
    });

    if (rpcUpdateError) {
        if (rpcUpdateError.message.includes("Could not find the function") || rpcUpdateError.code === "PGRST202") {
            console.error("❌ RPC function 'update_subscription' MISSING.");
        } else {
            console.log("✅ RPC function 'update_subscription' likely exists (" + rpcUpdateError.message + ")");
        }
    } else {
        console.log("✅ RPC function 'update_subscription' exists.");
    }
}

checkSupabase();
