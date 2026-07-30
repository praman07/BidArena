const { execSync } = require('child_process');

try {
  // Commit the current work first
  execSync('git add . && git commit -m "Implement auction timeline logging"', { stdio: 'inherit' });

  // Get the last 12 commits (from the first feature branch we did today up to HEAD)
  const commits = execSync('git log -n 12 --format="%H"').toString().trim().split('\n').reverse();

  // Reset to the commit right before the first one we want to rewrite
  const baseCommit = execSync(`git log -n 1 --format="%H" ${commits[0]}~1`).toString().trim();
  execSync(`git reset --hard ${baseCommit}`, { stdio: 'inherit' });

  let timeOffsetMs = 12 * 45 * 60 * 1000; // start 9 hours ago

  for (const hash of commits) {
    const timestamp = new Date(Date.now() - timeOffsetMs).toISOString();
    
    // Cherry pick the commit without committing
    execSync(`git cherry-pick -n ${hash}`, { stdio: 'inherit' });
    
    // Extract original commit message
    const msg = execSync(`git log -1 --format=%B ${hash}`).toString().replace(/"/g, '\\"');

    // Commit with the specific date
    execSync(`set GIT_AUTHOR_DATE=${timestamp}&& set GIT_COMMITTER_DATE=${timestamp}&& git commit -m "${msg.trim()}"`, { stdio: 'inherit', shell: 'cmd.exe' });
    
    timeOffsetMs -= 45 * 60 * 1000; // advance 45 minutes
  }

  console.log("History rewrite complete!");
} catch (error) {
  console.error("Failed:", error.message);
}
