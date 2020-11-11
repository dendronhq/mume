VERSION="0.15.1-alpha.1"

pkg="@dendronhq/engine-server@$VERSION"
yarn unlink @dendronhq/engine-server
echo "installing $pkg"
yarn add --force $pkg
