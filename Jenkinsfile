#!groovy

// tag image, push to repo, remove local tagged image
def tag_image_as(tag) {
  script {
    docker.image("${DOCKER_IMAGE_URL}:${env.COMMIT_HASH}").push(tag)
    sh "docker rmi ${DOCKER_IMAGE_URL}:${tag} || true"
  }
}

/*
* TODO: Change 'when' conditions to 'tag "v*"', to prevent us pushing to
  production when not intended (just because we tagged something that was not a
  release)
* TODO: Tag production image with git tag as well
* TODO: DRY-up: refacter image pushing & deployment to a function
*/

pipeline {
  agent any
  environment {
    APP = "invoertool"
    DOCKER_IMAGE_URL = "${DOCKER_REGISTRY_NO_PROTOCOL}/fixxx/invoertool"
  }

  stages {
    stage("Checkout") {
      steps {
        checkout scm
        script {
          env.COMMIT_HASH = sh(returnStdout: true, script: "git log -n 1 --pretty=format:'%h'").trim()
        }
      }
    }

    stage("Build docker image") {
      // We only build a docker image when we're not deploying to production,
      // to make make sure images deployed to production are deployed to
      // acceptance first.
      //
      // To deploy to production, tag an existing commit (that has already been
      // build) and push the tag.
      when { not { buildingTag() } }

      steps {
        script {
          def image = docker.build("${DOCKER_IMAGE_URL}:${env.COMMIT_HASH}",
            "--no-cache " +
            "--build-arg COMMIT_HASH=${env.COMMIT_HASH} " +
            "--build-arg BRANCH_NAME=${env.BRANCH_NAME} " +
            "--build-arg PUBLIC_URL=${env.PUBLIC_URL} " +
            "--shm-size 1G " +
            " .")
          image.push()
          tag_image_as("latest")
        }
      }
    }

    stage("Push acceptance image") {
      when { expression { "master" == env.BRANCH_NAME } }
      steps {
        tag_image_as("acceptance")
      }
    }

    stage("Deploy to acceptance") {
      when { expression { "master" == env.BRANCH_NAME } }
      steps {
        build job: 'Subtask_Openstack_Playbook',
          parameters: [
              [$class: 'StringParameterValue', name: 'INVENTORY', value: 'acceptance'],
              [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
              [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_${env.APP}"],
          ]
      }
    }

    stage("Push production image") {
      when { expression { "production" == env.BRANCH_NAME } }
      steps {
        tag_image_as("production")
      }
    }

    stage("Deploy to production") {
      when { expression { "production" == env.BRANCH_NAME } }
      steps {
        build job: 'Subtask_Openstack_Playbook',
          parameters: [
              [$class: 'StringParameterValue', name: 'INVENTORY', value: 'production'],
              [$class: 'StringParameterValue', name: 'PLAYBOOK', value: 'deploy.yml'],
              [$class: 'StringParameterValue', name: 'PLAYBOOKPARAMS', value: "-e cmdb_id=app_${env.APP}"],
          ]
      }
    }
  }

  post {
    always {
      script {
        // delete original image built on the build server
        sh "docker rmi ${DOCKER_IMAGE_URL}:${env.COMMIT_HASH} || true"
      }
    }
  }
}
