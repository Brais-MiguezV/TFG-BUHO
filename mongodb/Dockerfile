# Use the official MongoDB image
FROM mongodb/mongodb-community-server:latest

# Set the working directory
WORKDIR /home

# Copy database dump files and the restore script
COPY ./database /database

# Copy the entrypoint script
COPY ./database/entrypoint.sh /entrypoint.sh

# Expose MongoDB port
EXPOSE 27017

# Use the entrypoint script to start MongoDB and restore the database
ENTRYPOINT ["/entrypoint.sh"]
