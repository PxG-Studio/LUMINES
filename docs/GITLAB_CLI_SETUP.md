# GitLab CLI (glab) Setup for Self-Hosted GitLab

**glab** is the official GitLab CLI tool (similar to GitHub's `gh` CLI). Use it to interact with your self-hosted GitLab at `192.168.86.29` from the command line.

---

## Installation

### macOS (Homebrew)

```bash
brew install glab
```

### macOS (Manual)

```bash
# Download latest release
curl -s https://raw.githubusercontent.com/profclems/glab/main/scripts/install.sh | sudo sh
```

### Other Platforms

See: https://gitlab.com/gitlab-org/cli#installation

---

## Configuration for Self-Hosted GitLab

### 1. Authenticate with your GitLab instance

```bash
# Authenticate with your self-hosted GitLab
glab auth login --hostname 192.168.86.29 --api-host 192.168.86.29 --api-protocol http --git-protocol http
```

When prompted:
- **GitLab hostname:** `192.168.86.29`
- **GitLab protocol:** `http` (or `https` if you set up SSL)
- **Authenticate Git with:** `http` (or `ssh` if you prefer)
- **Token:** You'll need a **Personal Access Token** (see below)

### 2. Create Personal Access Token

1. Open **http://192.168.86.29** in your browser
2. Log in as **root** (or your user)
3. Go to **User Settings** (top right avatar) → **Access Tokens**
4. **Token name:** `glab-cli`
5. **Expiration date:** Set as needed (or leave blank for no expiration)
6. **Select scopes:** Check at minimum:
   - ✅ `api` (Full API access)
   - ✅ `write_repository` (Write repository)
   - ✅ `read_repository` (Read repository)
7. Click **Create personal access token**
8. **Copy the token** (you won't see it again!)

### 3. Use token with glab

**Option A: Paste token when prompted**
```bash
glab auth login --hostname 192.168.86.29
# When prompted, paste your token
```

**Option B: Provide token via stdin**
```bash
echo "your-token-here" | glab auth login --hostname 192.168.86.29 --stdin
```

**Option C: Set environment variable**
```bash
export GITLAB_TOKEN="your-token-here"
glab auth login --hostname 192.168.86.29
```

---

## Common glab Commands

### Repository Operations

```bash
# Clone a repository
glab repo clone pxg-studio/game-repo

# View repository info
glab repo view pxg-studio/game-repo

# Create a new repository
glab repo create lumines --group pxg-studio --private

# List repositories
glab repo list
```

### Merge Requests

```bash
# Create a merge request
glab mr create --title "Add feature" --description "Description here"

# List merge requests
glab mr list

# View a merge request
glab mr view 1

# Merge a merge request
glab mr merge 1

# Close a merge request
glab mr close 1
```

### Issues

```bash
# Create an issue
glab issue create --title "Bug report" --description "Details here"

# List issues
glab issue list

# View an issue
glab issue view 1

# Close an issue
glab issue close 1
```

### CI/CD

```bash
# View pipeline status
glab ci status

# View pipeline logs
glab ci view

# Retry a failed job
glab ci retry

# Cancel a running pipeline
glab ci cancel
```

### Variables (CI/CD)

```bash
# List CI/CD variables
glab variable list

# Set a CI/CD variable
glab variable set SSH_PRIVATE_KEY --value "$(cat deploy_key)"

# Get a variable value
glab variable get SSH_PRIVATE_KEY

# Delete a variable
glab variable delete SSH_PRIVATE_KEY
```

### Projects & Groups

```bash
# List projects in a group
glab repo list --group pxg-studio

# View group info
glab group view pxg-studio
```

---

## Setting Default Host

To avoid specifying `--hostname` every time:

```bash
# Set default host
glab config set host 192.168.86.29

# Or set environment variable
export GITLAB_HOST=192.168.86.29
```

Add to your `~/.zshrc` or `~/.bashrc`:
```bash
export GITLAB_HOST=192.168.86.29
```

---

## Example: Setting Up LUMINES Repo with glab

```bash
# 1. Authenticate (if not done)
glab auth login --hostname 192.168.86.29

# 2. Create the project (if it doesn't exist)
glab repo create lumines --group pxg-studio --private --description "PXG.STUDIO Game Development Repository"

# 3. Add remote
cd /Users/hiroyasu/Documents/GitHub/LUMINES
git remote add gitlab http://192.168.86.29/pxg-studio/lumines.git

# 4. Push branches
git push gitlab main develop prototype

# 5. Set CI/CD variable (SSH_PRIVATE_KEY)
glab variable set SSH_PRIVATE_KEY --value "$(cat deploy_key)" --masked --protected

# 6. View pipeline
glab ci status
```

---

## Configuration File

glab stores config at: `~/.config/glab-cli/config.yml`

You can edit it directly or use `glab config set` commands.

---

## Troubleshooting

### "Host not found" or connection errors

- Verify GitLab is accessible: `curl http://192.168.86.29`
- Check if you're using `http` vs `https` correctly
- Ensure token has correct scopes (`api`, `write_repository`)

### "Authentication failed"

- Verify token is correct (create a new one if needed)
- Check token hasn't expired
- Ensure token has required scopes

### "Repository not found"

- Verify you're authenticated to the correct hostname
- Check group/project path is correct: `pxg-studio/game-repo`
- Ensure you have access to the repository

---

## Resources

- **Official Docs:** https://docs.gitlab.com/cli/
- **GitHub Repo:** https://github.com/profclems/glab
- **GitLab Project:** https://gitlab.com/gitlab-org/cli

---

## Quick Reference

```bash
# Check if glab is installed
glab --version

# View current config
glab config list

# View authenticated hosts
glab auth status

# Get help
glab --help
glab <command> --help
```
