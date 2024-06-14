#!/bin/bash

# Wait for MongoDB to start
until mongosh --eval 'print("Waiting for MongoDB to start...")'; do
  sleep 5
done

# Restore the dump
mongorestore --drop /database/dump
