import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Setup Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

def get_db() -> Client:
    """Returns a Supabase client instance"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise Exception("Supabase URL or Key not found in environment variables.")
    return create_client(SUPABASE_URL, SUPABASE_KEY)
