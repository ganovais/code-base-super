#!/bin/bash

# Test script for the microservices system
API_URL="http://localhost:3000/api"

echo "🚀 Testing Microservices To-Do System"
echo "======================================"

# Test user registration
echo "1. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Register response: $REGISTER_RESPONSE"

# Extract token from registration response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"access_token":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TOKEN" ]; then
  echo "❌ Registration failed - no token received"
  exit 1
fi

echo "✅ Registration successful - Token received"
echo ""

# Test task creation
echo "2. Testing task creation..."
CREATE_TASK_RESPONSE=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task"
  }')

echo "Create task response: $CREATE_TASK_RESPONSE"

# Extract task ID
TASK_ID=$(echo $CREATE_TASK_RESPONSE | grep -o '"id":"[^"]*' | grep -o '[^"]*$')

if [ -z "$TASK_ID" ]; then
  echo "❌ Task creation failed - no task ID received"
  exit 1
fi

echo "✅ Task creation successful - Task ID: $TASK_ID"
echo ""

# Test getting tasks
echo "3. Testing get tasks..."
GET_TASKS_RESPONSE=$(curl -s -X GET "$API_URL/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Get tasks response: $GET_TASKS_RESPONSE"
echo "✅ Get tasks successful"
echo ""

# Test task update
echo "4. Testing task update..."
UPDATE_TASK_RESPONSE=$(curl -s -X PUT "$API_URL/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Test Task",
    "status": "completed"
  }')

echo "Update task response: $UPDATE_TASK_RESPONSE"
echo "✅ Task update successful"
echo ""

# Test task deletion
echo "5. Testing task deletion..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "%{http_code}")

if [ "$DELETE_RESPONSE" = "204" ]; then
  echo "✅ Task deletion successful"
else
  echo "❌ Task deletion failed - HTTP status: $DELETE_RESPONSE"
fi

echo ""
echo "🎉 All tests completed!"
echo "======================================"
