#!/usr/bin/env sh

#
# https://vitejs.dev/guide/static-deploy.html#github-pages
#

# abort on errors
set -e

GH_REPOSITORY_NAME='image-mixer-webapp'
GH_REPOSITORY_OWNER='guilhermerodrigues680'
GH_REPOSITORY_URL="git@github.com:${GH_REPOSITORY_OWNER}/${GH_REPOSITORY_NAME}.git"

# build
# https://vitejs.dev/guide/build.html#public-base-path
# https://stackoverflow.com/a/14404223
npm run build -- --base="/${GH_REPOSITORY_NAME}/"

# navigate into the build output directory
cd dist

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m "deploy $npm_package_name v$npm_package_version"

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

# Deploy na branch `gh-pages` do repositório
git push -f $GH_REPOSITORY_URL main:gh-pages

cd -