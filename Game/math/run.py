"""Run script for Golden Fortune Slots simulation and optimization"""

import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../math-sdk'))

from game_config import GameConfig
from gamestate import GameState
from src.state.run_sims import create_books
from src.write_data.write_configs import generate_configs


if __name__ == "__main__":
    # Simulation parameters
    num_threads = 10
    rust_threads = 20
    batching_size = 50000
    compression = True
    profiling = False

    # Number of simulations per bet mode
    num_sim_args = {
        "base": int(1e5),    # 100,000 base game simulations
        "bonus": int(1e5),   # 100,000 bonus game simulations
    }

    # Run conditions
    run_conditions = {
        "run_sims": True,
        "run_optimization": True,
        "run_analysis": True,
        "upload_data": False,
    }

    # Initialize game configuration and state
    config = GameConfig()
    gamestate = GameState(config)

    print("=" * 60)
    print(f"Golden Fortune Slots - Simulation Run")
    print(f"Game ID: {config.game_id}")
    print(f"RTP Target: {config.rtp * 100:.2f}%")
    print(f"Win Cap: {config.wincap}x")
    print(f"Base Simulations: {num_sim_args['base']:,}")
    print(f"Bonus Simulations: {num_sim_args['bonus']:,}")
    print("=" * 60)

    # Create simulation books
    if run_conditions["run_sims"]:
        print("\nGenerating simulation books...")
        create_books(
            gamestate,
            config,
            num_sim_args,
            batching_size,
            num_threads,
            compression,
            profiling,
        )
        print("✓ Books generated successfully")

    # Generate configuration files
    print("\nGenerating configuration files...")
    generate_configs(gamestate)
    print("✓ Configuration files generated")

    # Run optimization
    if run_conditions["run_optimization"]:
        print("\nRunning optimization algorithm...")
        print("Note: This may take several minutes depending on the number of simulations")
        # Optimization will be run via the math-sdk's optimization program

    # Run analysis
    if run_conditions["run_analysis"]:
        print("\nRunning game analysis...")
        # Analysis tools from math-sdk will generate PAR sheets

    print("\n" + "=" * 60)
    print("Simulation complete!")
    print(f"Output files located in: library/")
    print("=" * 60)
