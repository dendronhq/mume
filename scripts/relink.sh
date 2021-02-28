ENGINE_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/engine-server"]'`
COMMON_ALL_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/common-all"]'`
COMMON_TEST_UTILS_VERSION=`cat ../dendron/meta.json | jq -r '.["@dendronhq/common-test-utils"]'`

pkg1="@dendronhq/engine-server@$ENGINE_VERSION"
pkg2="@dendronhq/common-all@$COMMON_ALL_VERSION"
pkg3="@dendronhq/common-test-utils@$COMMON_TEST_UTILS_VERSION"
yarn unlink @dendronhq/engine-server
yarn unlink @dendronhq/common-all
yarn unlink @dendronhq/common-test-utils
echo "installing $pkg"
yarn add --force $pkg1 &
yarn add --force $pkg2 &
yarn add --force $pkg3 &
