#!/bin/bash

# Start MongoDB in the background
mongod --fork --logpath /var/log/mongod.log --bind_ip_all

# Wait for MongoDB to start


# Restore the database
mongorestore /database/dump

# Keep MongoDB running in the foreground
mongod --bind_ip_all
