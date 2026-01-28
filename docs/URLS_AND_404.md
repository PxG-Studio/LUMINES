# URLs and 404 on 192.168.86.29

## Why you see 404 at `192.168.86.29/pxg-stu...`

The path **/pxg-studio/...** is your **GitLab** project URL (port 80). You get **404** until:

1. **GitLab is running** and you’ve done the first-time setup in the browser.
2. You’ve **created the group and project**: group **PXG.STUDIO** (path `pxg-studio`) and project **game-repo** (path `pxg-studio/game-repo`).

Until then, GitLab has no project at that path, so Nginx (or GitLab) correctly returns 404.

---

## Correct URLs

| What | URL | When it works |
|------|-----|----------------|
| **GitLab (login / dashboard)** | http://192.168.86.29 | After GitLab container is up; set root password on first visit. |
| **GitLab project** | http://192.168.86.29/pxg-studio/game-repo | After you create group `pxg-studio` and project `game-repo` in GitLab. |
| **Game (production)** | http://192.168.86.29:8080 | After deploy; we added a placeholder so this always returns a page. |
| **Game (staging)** | http://192.168.86.29:8081 | Same, for staging deploy. |

---

## What to do step by step

1. **Open GitLab root (no path)**  
   http://192.168.86.29  
   - If you see a password reset or login page: set the root password, then log in.  
   - If you get 502/connection error: GitLab isn’t ready yet; see [SBX04_FINAL_STEPS.md](SBX04_FINAL_STEPS.md) to check containers and logs.

2. **Create group and project**  
   In GitLab: **New project** → **Create group** → name **PXG.STUDIO**, path **pxg-studio** → then create project **game-repo** under that group.  
   After that, **http://192.168.86.29/pxg-studio/game-repo** will work (no more 404 for that path).

3. **Game app**  
   Use **http://192.168.86.29:8080** (production) and **http://192.168.86.29:8081** (staging). These are separate from GitLab and serve files from `/var/www/game` and `/var/www/staging`.

---

## Summary

- **404 on /pxg-studio/...** → Finish GitLab first-time setup and create the `pxg-studio` group and `game-repo` project.
- **Game live URL** → http://192.168.86.29**:**8080 (note the port).
