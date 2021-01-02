VERSION="0.22.2-alpha.0"

pkg1="@dendronhq/engine-server@$VERSION"
pkg2="@dendronhq/common-all@$VERSION"
pkg3="@dendronhq/common-test-utils@$VERSION"
yarn unlink @dendronhq/engine-server
yarn unlink @dendronhq/common-all
yarn unlink @dendronhq/common-test-utils
echo "installing $pkg"
yarn add --force $pkg1
yarn add --force $pkg2
yarn add --force $pkg3
