source .env
echo "Invoking $WEBHOOK_URL..."
curl -s -XPOST "$WEBHOOK_URL" -d "@./tmp/request.json" -H "Content-Type: application/json" | jq '{result,message,status}'