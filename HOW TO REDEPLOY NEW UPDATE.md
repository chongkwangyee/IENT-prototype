# How To Redeploy New Updates To Vercel

This guide explains how to update the Study Mesh website after making changes to the files.

## Option 1: Update Through GitHub Website

Use this if you are editing files manually in GitHub.

1. Go to the GitHub repository:

   ```text
   https://github.com/chongkwangyee/IENT-prototype
   ```

2. Click the file you want to update.

3. Click the pencil icon to edit the file.

4. Make your changes.

5. Scroll down to `Commit changes`.

6. Write a short message, for example:

   ```text
   Update Study Mesh homepage
   ```

7. Click `Commit changes`.

8. Vercel will automatically redeploy the website.

9. Go to your Vercel dashboard and open the project to check deployment status.

## Option 2: Upload Updated Files Through GitHub

Use this if you edited files on your computer.

1. Go to the GitHub repository:

   ```text
   https://github.com/chongkwangyee/IENT-prototype
   ```

2. Click `Add file`.

3. Click `Upload files`.

4. Drag in the updated files, such as:

   - `index.html`
   - `styles.css`
   - `script.js`
   - `profile.html`
   - `notes.html`

5. If GitHub asks whether to replace files, allow it.

6. Scroll down and click `Commit changes`.

7. Vercel will automatically redeploy.

## Option 3: Update With Git Commands

Use this if the repository is already cloned on your computer.

```powershell
git status
git add .
git commit -m "Update Study Mesh prototype"
git push
```

After `git push`, Vercel will redeploy automatically.

## Vercel Settings

For this project, Vercel should use:

```text
Framework Preset: Other
Build Command: leave empty
Output Directory: .
Install Command: leave empty
```

## How To Check If Redeploy Worked

1. Open Vercel.
2. Go to the Study Mesh project.
3. Click the latest deployment.
4. Confirm the status says `Ready`.
5. Open the live website link.
6. Hard refresh the browser:

   - Windows: `Ctrl + F5`
   - Mac: `Cmd + Shift + R`

## Common Problems

### The Website Did Not Change

Try a hard refresh. If it still does not change, check that the updated files were committed to GitHub.

### Vercel Shows An Error

Check that `index.html` is still in the root folder of the repository. This project does not need a build command.

### A Page Link Is Broken

Make sure the target HTML file exists in the root folder and the link matches the filename exactly.

Example:

```html
<a href="notes.html">Notes</a>
```

## Quick Update Checklist

- Edit the file.
- Commit or upload it to GitHub.
- Wait for Vercel to redeploy.
- Open the live site.
- Hard refresh.
- Test the changed page.
