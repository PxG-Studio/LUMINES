# Add SSH_PRIVATE_KEY to GitLab (one-time)

The deploy key **public** key is already on the server (SBX04). To let the CI pipeline deploy to production, add the **private** key as a GitLab CI/CD variable.

## Steps

1. **Open your project in GitLab**  
   http://192.168.86.29/pxg-studio/game-repo (or your project URL).

2. **Go to CI/CD variables**  
   **Settings** → **CI/CD** → **Variables** → **Expand**.

3. **Add a variable**
   - **Key**: `SSH_PRIVATE_KEY`
   - **Value**: paste the **entire contents** of the file `deploy_key` in your repo root (including the `-----BEGIN ... KEY-----` and `-----END ... KEY-----` lines).
   - **Type**: Variable  
   - **Flags**: check **Mask variable** and **Protect variable**  
   - Click **Add variable**.

4. **(Optional)** Remove the key file from your machine after adding it to GitLab:  
   `rm deploy_key deploy_key.pub`

## Get the value to paste

From your repo root:

```bash
cat deploy_key
```

Copy the full output and paste it into the **Value** field in GitLab. Do not share this value or commit it.

## If you don’t have `deploy_key` anymore

Generate a new key and add the public key to the server again:

```bash
bash scripts/generate-deploy-key.sh
ssh-copy-id -i ./deploy_key.pub ncadmin@192.168.86.29
# Then add the contents of deploy_key to GitLab as above.
```
