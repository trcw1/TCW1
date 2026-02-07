#!/bin/bash

# TCW1 Monitor - Health Check Script
# Usage: bash monitor.sh <your-domain.com>

set -e

DOMAIN=${1:-yourdomain.com}
API_URL="https://api.$DOMAIN"
FRONTEND_URL="https://$DOMAIN"
COLORS='\033[0m\033[32m\033[31m\033[33m\033[34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========== TCW1 Health Monitor ==========${NC}"
echo -e "Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "Checking: $(date)"
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    
    echo -n "Testing $name... "
    
    if curl -s -o /dev/null -w "%{http_code}" -m 5 "$url" > /tmp/status_code.txt; then
        local status=$(cat /tmp/status_code.txt)
        
        if [ "$status" == "200" ] || [ "$status" == "301" ] || [ "$status" == "302" ]; then
            echo -e "${GREEN}✓ OK (HTTP $status)${NC}"
            return 0
        elif [ "$status" == "000" ]; then
            echo -e "${RED}✗ TIMEOUT${NC}"
            return 1
        else
            echo -e "${YELLOW}⚠ HTTP $status${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ ERROR${NC}"
        return 1
    fi
}

# Function to test DNS
test_dns() {
    echo -n "Testing DNS for $DOMAIN... "
    
    if nslookup "$DOMAIN" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Resolves${NC}"
        nslookup "$DOMAIN" | grep -A 1 "Name:"
        return 0
    else
        echo -e "${RED}✗ Cannot resolve${NC}"
        return 1
    fi
}

# Tests
echo -e "${BLUE}DNS Tests:${NC}"
test_dns
echo ""

echo -e "${BLUE}API Tests:${NC}"
test_endpoint "API Health" "$API_URL/health"
test_endpoint "API Root" "$API_URL/"
echo ""

echo -e "${BLUE}Frontend Tests:${NC}"
test_endpoint "Frontend Home" "$FRONTEND_URL"
test_endpoint "Frontend Health" "$FRONTEND_URL/health"
echo ""

echo -e "${BLUE}SSL/TLS Tests:${NC}"
echo -n "Checking SSL Certificate... "
if openssl s_client -connect "$DOMAIN":443 < /dev/null 2>/dev/null | grep "Verify return code: 0 (ok)" > /dev/null; then
    echo -e "${GREEN}✓ Valid${NC}"
else
    echo -e "${YELLOW}⚠ Check manually${NC}"
fi

echo ""
echo -e "${BLUE}Response Time Tests:${NC}"
echo -n "API Response Time: "
time curl -s "$API_URL/health" > /dev/null

echo ""
echo -e "${BLUE}========== Summary ==========${NC}"
echo -e "Frontend: ${FRONTEND_URL}"
echo -e "API:      ${API_URL}"
echo -e "Status:   ${GREEN}✓ Operational${NC}"
echo -e "Time:     $(date)"
