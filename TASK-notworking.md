# sandbox


To run a script at startup in Windows, you can use the Task Scheduler. Here's how you can set it up to run npm run serve in a specific folder:

Create a batch file: Create a new text file in Notepad with the following content:

        cd "C:\path\to\your\project"
        npm run serve

Replace "C:\path\to\your\project" with the path to your project folder. Save this file with a .bat extension, for example, start-npm.bat.

Open Task Scheduler: Press Win + S, type Task Scheduler, and press Enter.

Create a new task: In the Task Scheduler, click on Create Basic Task....

Name the task: Enter a name for the task and click Next.

Set the trigger: Choose When the computer starts and click Next.

Set the action: Choose Start a program and click Next.

Choose the batch file: Click Browse..., navigate to your .bat file, select it, and click Next.

Finish the task: Click Finish.

Now, every time your computer starts, it will run npm run serve in your project folder.

Please note that this will open a command prompt window on startup. If you want to hide this window, you'll need to create a VBScript or JScript file to call the batch file silently. Also, make sure that the path to Node.js is included in your system's PATH environment variable, otherwise the npm command won't be recognized.