pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci --prefix server'
                sh 'npm ci --prefix client'
            }
        }

        stage('Build client') {
            steps {
                sh 'npm run build --prefix client'
            }
        }

        stage('Build Docker images') {
            steps {
                sh 'docker build -t fixly-server:${BUILD_NUMBER} ./server'
                sh 'docker build --build-arg VITE_API_URL=/api -t fixly-client:${BUILD_NUMBER} ./client'
            }
        }

        stage('Deploy with Docker Compose') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([
                    string(credentialsId: 'fixly-jwt-secret', variable: 'FIXLY_JWT_SECRET'),
                    string(credentialsId: 'fixly-admin-email', variable: 'FIXLY_ADMIN_EMAIL'),
                    string(credentialsId: 'fixly-admin-password', variable: 'FIXLY_ADMIN_PASSWORD')
                ]) {
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
