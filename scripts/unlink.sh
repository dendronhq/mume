VERSION="0.12.11-alpha.3"

pkg="@dendronhq/engine-server@$VERSION"
yarn unlink @dendronhq/engine-server
echo "installing $pkg"
yarn add --force $pkg
