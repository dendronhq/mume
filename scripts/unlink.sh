VERSION="0.10.5-alpha.1"

pkg="@dendronhq/engine-server@$VERSION"
yarn unlink @dendronhq/engine-server
echo "installing $pkg"
yarn add --force $pkg
