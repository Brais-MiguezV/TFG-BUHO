# Use the official Python image from the Docker Hub
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the local code to the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir fastapi uvicorn

# Expose the port the app runs on
EXPOSE 8000

# Command to run the app using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]