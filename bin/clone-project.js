import simpleGit from "simple-git";
import { color } from "console-log-colors";

const cloneRepo = async (repoUrl, destinationPath) => {
  try {
    const git = simpleGit();
    await git.clone(repoUrl, destinationPath);
    console.log(color.green(`✔️  Repository cloned to ${destinationPath}`));
  } catch (error) {
    console.error(color.red("❌ Failed to clone repository:"), error);
  }
};

export default cloneRepo;
