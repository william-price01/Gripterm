import os

def is_running_in_managed_environment() -> bool:
    """Determine if the program is running in a managed environment (e.g., Griptape Cloud or Skatepark emulator).

    Returns:
        bool: True if the program is running in a managed environment, False otherwise.
    """
    return "GT_CLOUD_STRUCTURE_RUN_ID" in os.environ
