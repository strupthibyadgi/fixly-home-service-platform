pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(
            name: 'DEPLOY_TO_DOCKER',
            defaultValue: false,
            description: 'Deploy the main branch to this Jenkins agent using Docker Compose.'
        )
    }

    stages {
        stage('Install') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm ci --prefix server'
                        sh 'npm ci --prefix client'
                    } else {
                        bat 'npm.cmd ci --prefix server'
                        bat 'npm.cmd ci --prefix client'
                    }
                }
            }
        }

        stage('Build client') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build --prefix client'
                    } else {
                        bat 'npm.cmd run build --prefix client'
                    }
                }
            }
        }

        stage('Build Docker images') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker build -t fixly-server:${BUILD_NUMBER} ./server'
                        sh 'docker build --build-arg VITE_API_URL=/api -t fixly-client:${BUILD_NUMBER} ./client'
                    } else {
                        bat 'docker build -t fixly-server:%BUILD_NUMBER% ./server'
                        bat 'docker build --build-arg VITE_API_URL=/api -t fixly-client:%BUILD_NUMBER% ./client'
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            when {
                allOf {
                    branch 'main'
                    expression { params.DEPLOY_TO_DOCKER }
                }
            }
            steps {
                withCredentials([
                    string(credentialsId: 'fixly-jwt-secret', variable: 'FIXLY_JWT_SECRET'),
                    string(credentialsId: 'fixly-admin-email', variable: 'FIXLY_ADMIN_EMAIL'),
                    string(credentialsId: 'fixly-admin-password', variable: 'FIXLY_ADMIN_PASSWORD')
                ]) {
                    script {
                        if (isUnix()) {
                            sh '''
                                set +x
                                umask 077
                                trap 'rm -f server/.env' EXIT
                                {
                                    printf '%s\\n' 'PORT=5001'
                                    printf 'JWT_SECRET=%s\\n' "$FIXLY_JWT_SECRET"
                                    printf '%s\\n' 'JWT_EXPIRES_IN=7d'
                                    printf '%s\\n' 'ADMIN_NAME=Platform Admin'
                                    printf 'ADMIN_EMAIL=%s\\n' "$FIXLY_ADMIN_EMAIL"
                                    printf 'ADMIN_PASSWORD=%s\\n' "$FIXLY_ADMIN_PASSWORD"
                                } > server/.env
                                docker compose up -d --build
                            '''
                        } else {
                            bat '''
                                @echo off
                                powershell.exe -NoLogo -NoProfile -NonInteractive -Command "$ErrorActionPreference='Stop'; $path=Join-Path $PWD 'server/.env'; try { $lines=@('PORT=5001','JWT_SECRET='+$env:FIXLY_JWT_SECRET,'JWT_EXPIRES_IN=7d','ADMIN_NAME=Platform Admin','ADMIN_EMAIL='+$env:FIXLY_ADMIN_EMAIL,'ADMIN_PASSWORD='+$env:FIXLY_ADMIN_PASSWORD); [IO.File]::WriteAllLines($path,$lines,[Text.UTF8Encoding]::new($false)); & docker compose up -d --build; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } } finally { Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue }"
                                if errorlevel 1 exit /b %errorlevel%
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            deleteDir()
        }
    }
}
