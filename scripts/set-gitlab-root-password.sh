#!/usr/bin/env bash
# Set GitLab root user password. Run on SBX04 (e.g. after copying to server).
# Usage: GITLAB_ROOT_PASS='YourPassword' bash set-gitlab-root-password.sh
# Or set below and run: bash set-gitlab-root-password.sh

GITLAB_ROOT_PASS="${GITLAB_ROOT_PASS:-C0mp0\$e2k3!!}"
set -e
cd ~/gitlab-production

export GITLAB_ROOT_PASS
docker-compose exec -T -e GITLAB_ROOT_PASS gitlab gitlab-rails runner "
u = User.find_by(username: 'root')
if u
  p = ENV['GITLAB_ROOT_PASS']
  u.password = p
  u.password_confirmation = p
  u.save!
  puts 'OK: Root password set. Log in at http://192.168.86.29 as root.'
else
  puts 'ERROR: Root user not found.'
end
"
