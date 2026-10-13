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
    }

    post {
        always {
            cleanWs()
        }
    }
}
