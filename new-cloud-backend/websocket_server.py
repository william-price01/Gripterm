import asyncio
import websockets
import json
import logging
from database_agent import create_agent

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create a single instance of the agent
griptape_agent = create_agent()

async def handle_client(websocket, path):
    client_id = id(websocket)
    logger.info(f"New client connected: {client_id}")
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                query = data.get('query')

                if query:
                    logger.info(f"Received query from client {client_id}: {query}")
                    # Process the query through the agent
                    response = griptape_agent.process_query(query)
                    logger.info(f"Sending response to client {client_id}")
                    # Send the response back to the client
                    await websocket.send(json.dumps(response))
                else:
                    logger.warning(f"Received invalid request from client {client_id}")
                    await websocket.send(json.dumps({"error": "Invalid request"}))
            except json.JSONDecodeError:
                logger.error(f"Received invalid JSON from client {client_id}")
                await websocket.send(json.dumps({"error": "Invalid JSON"}))
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Client disconnected: {client_id}")
    except Exception as e:
        logger.error(f"Error handling client {client_id}: {str(e)}")

async def main():
    server = await websockets.serve(
        handle_client,
        "localhost",
        8765,
        ping_interval=None,  # Disable automatic pings
    )
    logger.info("WebSocket server started on ws://localhost:8765")
    await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
