@echo off
REM Temporary helper to set JAVA_HOME for this process and run mvn
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.2"
set "PATH=%JAVA_HOME%\bin;%PATH%"
"C:\maven\apache-maven-3.9.9-bin\apache-maven-3.9.9\bin\mvn.cmd" -v
