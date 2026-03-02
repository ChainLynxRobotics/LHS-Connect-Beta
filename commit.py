import subprocess
import sys

def run_background_workflow():
    logger_script = "./git logger/update-git-log.py"
    
    # Popen starts the process and moves on immediately without waiting
    print("--- Starting logger in background ---")
    subprocess.Popen([sys.executable, logger_script])

    # This runs while the script above is still working
    print("--- Running Git commit ---")
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", "Background log update"], check=True)

if __name__ == "__main__":
    run_background_workflow()