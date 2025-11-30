# Security Fix: golang.org/x/net Vulnerabilities

## Issues Addressed

### Issue #6: Cross-site Scripting (XSS) - Moderate
- **CVE**: CVE-2025-22872
- **Description**: Tokenizer incorrectly interprets tags with unquoted attribute values ending with `/` as self-closing, leading to improper DOM construction
- **Fixed in**: golang.org/x/net v0.38.0+

### Issue #5: HTTP Proxy bypass using IPv6 Zone IDs - Moderate
- **CVE**: CVE-2025-22870
- **Description**: Improper NO_PROXY host matching allows proxy bypass when using IPv6 Zone IDs
- **Fixed in**: golang.org/x/net v0.38.0+

## Solution

Updated `golang.org/x/net` to **v0.47.0** (latest stable version) which includes fixes for both vulnerabilities.

## Update Command

```bash
cd infrastructure/k8s/production/helios-v2/gpu-scheduling/custom-wsl2-device-plugin
go get golang.org/x/net@v0.47.0
go mod tidy
go mod verify
```

## Verification

After updating, verify the fix:

```bash
go list -m golang.org/x/net
# Should show: golang.org/x/net v0.47.0
```

## References

- [CVE-2025-22872](https://github.com/advisories/GHSA-vvgc-356p-c3xw)
- [CVE-2025-22870](https://github.com/advisories/GHSA-qxp5-gwg8-xv66)
- [golang.org/x/net releases](https://github.com/golang/net/releases)

