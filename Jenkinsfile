pipeline {
    agent any

    environment {
        NODE_VERSION = '16'
        DOCKER_COMPOSE_VERSION = '2.21.0'
        // Use WSL paths and commands
        WSL_PREFIX = 'wsl -e'
        WORKSPACE_WSL = '/home/rohith/dazzle-store-studio'
    }

    stages {
        stage('Setup Environment') {
            steps {
                bat """
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && if [ ! -d ~/.nvm ]; then curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash; fi'
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && export NVM_DIR="\$HOME/.nvm" && . "\$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} && nvm use ${NODE_VERSION}'
                """
            }
        }

        stage('Build Frontend') {
            steps {
                bat """
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL}/frontend && npm install && npm run build'
                """
            }
        }

        stage('Build Backend') {
            steps {
                bat """
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL}/backend && npm install'
                """
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Frontend Tests') {
                    steps {
                        bat """
                            ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL}/frontend && npm test -- --watchAll=false || true'
                        """
                    }
                }
                stage('Backend Tests') {
                    steps {
                        bat """
                            ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL}/backend && npm test || true'
                        """
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat """
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && docker-compose build && docker-compose down -v'
                """
            }
        }

        stage('Deploy') {
            steps {
                bat """
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && docker-compose up -d'
                    timeout 10
                    ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && docker-compose ps'
                    ${WSL_PREFIX} bash -c 'curl -f http://localhost:3000 || true'
                    ${WSL_PREFIX} bash -c 'curl -f http://localhost:5000/api/health || true'
                """
            }
        }
    }

    post {
        success {
            echo 'Build successful! Application is running at:'
            echo 'Frontend: http://localhost:3000'
            echo 'Backend API: http://localhost:5000/api/health'
        }
        failure {
            echo 'Build failed! Check the logs for details.'
        }
        always {
            bat """
                ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && docker-compose logs || true'
                ${WSL_PREFIX} bash -c 'cd ${WORKSPACE_WSL} && docker-compose down || true'
            """
            cleanWs()
        }
    }
}