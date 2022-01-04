type GenericObject = { [key: string]: string };
type DecimalObject = { [key: string]: number };

const addrs_to_token: GenericObject = {
  '0x72cb10c6bfa5624dd07ef608027e366bd690048f': 'JewelToken',
  '0xa9ce83507d872c5e1273e745abcfda849daa654f': 'xJewel',
  '0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04': 'GaiasTears',
  '0x3a4edcf3312f44ef027acfd8c21382a5259936e7': 'DFKGold',
  '0x6e1bc01cc52d165b357c42042cf608159a2b81c1': 'Ambertaffy',
  '0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7': 'Darkweed',
  '0x600541ad6ce0a8b5dae68f086d46361534d20e80': 'Goldvein',
  '0x043f9bd9bb17dfc90de3d416422695dd8fa44486': 'Ragweed',
  '0x094243dfabfbb3e6f71814618ace53f07362a84c': 'Redleaf',
  '0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2': 'Rockroot',
  '0xcdffe898e687e941b124dfb7d24983266492ef1d': 'SwiftThistle',
  '0x78aed65a2cc40c7d8b0df1554da60b38ad351432': 'Bloater',
  '0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa': 'Ironscale',
  '0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be': 'Lanterneye',
  '0xc5891912718ccffcc9732d1942ccd98d5934c2e1': 'Redgill',
  '0xb80a07e13240c31ec6dc0b5d72af79d461da3a70': 'Sailfish',
  '0x372caf681353758f985597a35266f7b330a2a44d': 'Shimmerskin',
  '0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69': 'Silverfin',
  '0x66f5bfd910cd83d3766c4b39d13730c911b2d286': 'ShvasRune',
  '0x9678518e04fe02fb30b55e2d0e554e26306d0892': 'BluePetEgg',
  '0x95d02c1dc58f05a015275eb49e107137d9ee81dc': 'GreyPetEgg',
  '0x6d605303e9ac53c59a3da1ece36c9660c7a71da5': 'GreenPetEgg',
  '0x3db1fd0ad479a46216919758144fd15a21c3e93c': 'YellowPetEgg',
  '0x9edb3da18be4b03857f3d39f83e5c6aad67bc148': 'GoldenEgg',
  '0xac5c49ff7e813de1947dc74bbb1720c353079ac9': 'BlueStem',
  '0xc0214b37fcd01511e6283af5423cf24c96bb9808': 'MilkWeed',
  '0x19b9f05cde7a61ab7aae5b0ed91aa62ff51cf881': 'SpiderFruit',
  '0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c': 'Hero',
  '0x9014b937069918bd319f80e8b3bb4a2cf6faa5f7': 'UniswapV2Factory',
  '0x24ad62502d1c652cc7684081169d04896ac20f30': 'UniswapV2Router02',
  '0x3685ec75ea531424bbe67db11e07013abeb95f1e': 'Banker',
  '0xdb30643c71ac9e2122ca0341ed77d09d5f99f924': 'MasterGardener',
  '0x5100bd31b822371108a0f63dcfb6594b9919eaf4': 'QuestCoreV2',
};

const decimals: DecimalObject = {
  '0x72cb10c6bfa5624dd07ef608027e366bd690048f': 18,
  '0xa9ce83507d872c5e1273e745abcfda849daa654f': 18,
  '0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04': 0,
  '0x3a4edcf3312f44ef027acfd8c21382a5259936e7': 3,
  '0x6e1bc01cc52d165b357c42042cf608159a2b81c1': 0,
  '0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7': 0,
  '0x600541ad6ce0a8b5dae68f086d46361534d20e80': 0,
  '0x043f9bd9bb17dfc90de3d416422695dd8fa44486': 0,
  '0x094243dfabfbb3e6f71814618ace53f07362a84c': 0,
  '0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2': 0,
  '0xcdffe898e687e941b124dfb7d24983266492ef1d': 0,
  '0x78aed65a2cc40c7d8b0df1554da60b38ad351432': 0,
  '0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa': 0,
  '0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be': 0,
  '0xc5891912718ccffcc9732d1942ccd98d5934c2e1': 0,
  '0xb80a07e13240c31ec6dc0b5d72af79d461da3a70': 0,
  '0x372caf681353758f985597a35266f7b330a2a44d': 0,
  '0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69': 0,
  '0x66f5bfd910cd83d3766c4b39d13730c911b2d286': 0,
  '0x9678518e04fe02fb30b55e2d0e554e26306d0892': 0,
  '0x95d02c1dc58f05a015275eb49e107137d9ee81dc': 0,
  '0x6d605303e9ac53c59a3da1ece36c9660c7a71da5': 0,
  '0x3db1fd0ad479a46216919758144fd15a21c3e93c': 0,
  '0x9edb3da18be4b03857f3d39f83e5c6aad67bc148': 0,
  '0xac5c49ff7e813de1947dc74bbb1720c353079ac9': 0,
  '0xc0214b37fcd01511e6283af5423cf24c96bb9808': 0,
  '0x19b9f05cde7a61ab7aae5b0ed91aa62ff51cf881': 0,
};

const token_to_addrs: GenericObject = {
  JewelToken: '0x72cb10c6bfa5624dd07ef608027e366bd690048f',
  xJEWEL: '0xa9ce83507d872c5e1273e745abcfda849daa654f',
  GaiasTears: '0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04',
  DFKGold: '0x3a4edcf3312f44ef027acfd8c21382a5259936e7',
  Ambertaffy: '0x6e1bc01cc52d165b357c42042cf608159a2b81c1',
  Darkweed: '0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7',
  Goldvein: '0x600541ad6ce0a8b5dae68f086d46361534d20e80',
  Ragweed: '0x043f9bd9bb17dfc90de3d416422695dd8fa44486',
  Redleaf: '0x094243dfabfbb3e6f71814618ace53f07362a84c',
  Rockroot: '0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2',
  SwiftThistle: '0xcdffe898e687e941b124dfb7d24983266492ef1d',
  Bloater: '0x78aed65a2cc40c7d8b0df1554da60b38ad351432',
  Ironscale: '0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa',
  Lanterneye: '0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be',
  Redgill: '0xc5891912718ccffcc9732d1942ccd98d5934c2e1',
  Sailfish: '0xb80a07e13240c31ec6dc0b5d72af79d461da3a70',
  Shimmerskin: '0x372caf681353758f985597a35266f7b330a2a44d',
  Silverfin: '0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69',
  ShvasRune: '0x66f5bfd910cd83d3766c4b39d13730c911b2d286',
  BluePetEgg: '0x9678518e04fe02fb30b55e2d0e554e26306d0892',
  GreyPetEgg: '0x95d02c1dc58f05a015275eb49e107137d9ee81dc',
  GreenPetEgg: '0x6d605303e9ac53c59a3da1ece36c9660c7a71da5',
  YellowPetEgg: '0x3db1fd0ad479a46216919758144fd15a21c3e93c',
  GoldenEgg: '0x9edb3da18be4b03857f3d39f83e5c6aad67bc148',
  BlueStem: '0xac5c49ff7e813de1947dc74bbb1720c353079ac9',
  MilkWeed: '0xc0214b37fcd01511e6283af5423cf24c96bb9808',
  SpiderFruit: '0x19b9f05cde7a61ab7aae5b0ed91aa62ff51cf881',
  Hero: '0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c',
  UniswapV2Factory: '0x9014b937069918bd319f80e8b3bb4a2cf6faa5f7',
  UniswapV2Router02: '0x24ad62502d1c652cc7684081169d04896ac20f30',
  Banker: '0x3685ec75ea531424bbe67db11e07013abeb95f1e',
  MasterGardener: '0xdb30643c71ac9e2122ca0341ed77d09d5f99f924',
  QuestCoreV2: '0x5100bd31b822371108a0f63dcfb6594b9919eaf4',
};

const LP_PAIRS = [
  '0x321eafb0aed358966a90513290de99763946a54b', // dfkgold
  '0xb270556714136049b27485f1aa8089b10f6f7f57', // dfkshvas
  '0xc79245ba0248abe8a385d588c0a9d3db261b453c', // dfktears
  '0x46e81f6e157245caf138c4fb564d6db2711cebbb', // dfkshimmerskin
  '0x4758f4d2097aa2bd8f575c345d64abecfd552e4b', // dfkgregg
  '0xc41235202daa55064d69981b6de4b7947868bb45', // dfkbloater
  '0x5898e31d82afdb1d65edefe0601714a60f461201', // dfksilverfin
  '0x7d65edc0e1449d13be1141ce29e5a984d04aa374', // dfkswfthsl
  '0x399d025fe22203357da9a5c9ff9888b7c25cc899', // dfkgldvn
  '0x2e7276584897a099d07b118fad51ad8c169f01ee', // dfkrgwd
  '0x0bc8b60bcc36f39d77922d554424e1944ec7ca61', // dfkrdlf
  '0xc5d215ff592bea454146135542e72e0ae520406f', // dfkredgill
  '0x92ecb67043aac4b876cdf2a5f98b8aefafe7cfc6', // dfkdrkwd
  '0x41003cd3a8684cc1ec877cd8590f49d17a0bab71', // dfkambrtfy
  '0xd0068dad1cbbab7412b53ecfd4f5782a18568147', // dfklanterneye
  '0x3d864c9cdc9d5ef3ef78ddfa0f1514f98313dc5c', // dfkrckrt
  '0xc8ded2476fe5379b56cf1603ba0d278c5d7a3974', // dfksailfish
  '0xaa01bd693f3638700a0946ab8452c97afb59b93e', // dfkironscale
  '0xd2239146b69bfe5dbfe78ad69c4b435365ddefd1', // dfkspidrfrt
  '0x352c159860f2b89a9e36c7e9bf9a9a262cba0244', // dfkbluestem
  '0xb6a51bfeeeeafcf669e76ead260d3ae135257499', // dfkmilkweed
];
const OTHER_LP_PAIRS = [
  '0xeb579ddcd49a7beb3f205c9ff6006bb6390f138f', // WONE
  '0xa1221a5bbea699f507cc00bdedea05b5d2e32eba', // 1USDC
  '0xb91a0dfa0178500fedc526f26a89803c387772e8', // UST
  '0x093956649d43f23fe4e7144fb1c3ad01586ccf1e', // AVAX
  '0xeab84868f6c8569e14263a5326ecd62f5328a70f', // 1ETH
  '0x0acce15d05b4ba4dbedfd7afd51ea4fa1592f75e', // 1WBTC
  '0x7f89b5f33138c89fad4092a7c079973c95362d53', // FTM
  '0xe01502db14929b7733e7112e173c3bcf566f996e', // BUSD
  '0xb6e9754b90b338ccb2a74fa31de48ad89f65ec5e', // LUNA
  '0xe7d0116dd1dbbba2efbad58f097d1ffbbedc4923', // bscBNB
  '0x751606585fcaa73bf92cf823b7b6d8a0398a1c99', // MIS
  '0x3733062773b24f9bafa1e8f2e5a352976f008a95', // XYA
];
const QUEST_TOKEN_ADDRESSES = [
  '0x72cb10c6bfa5624dd07ef608027e366bd690048f', // jewel
  '0x24ea0d436d3c2602fbfefbe6a16bbc304c963d04', // gaia tears
  '0x6e1bc01cc52d165b357c42042cf608159a2b81c1', // ambertaffy
  '0x68ea4640c5ce6cc0c9a1f17b7b882cb1cbeaccd7', // darkweed
  '0x600541ad6ce0a8b5dae68f086d46361534d20e80', // goldvein
  '0x043f9bd9bb17dfc90de3d416422695dd8fa44486', // ragweed
  '0x094243dfabfbb3e6f71814618ace53f07362a84c', // redleaf
  '0x6b10ad6e3b99090de20bf9f95f960addc35ef3e2', // rockroot
  '0xcdffe898e687e941b124dfb7d24983266492ef1d', // swiftthistle
  '0x78aed65a2cc40c7d8b0df1554da60b38ad351432', // bloater
  '0xe4cfee5bf05cef3418da74cfb89727d8e4fee9fa', // ironscale
  '0x8bf4a0888451c6b5412bcad3d9da3dcf5c6ca7be', // lanterneye
  '0xc5891912718ccffcc9732d1942ccd98d5934c2e1', // redgill
  '0xb80a07e13240c31ec6dc0b5d72af79d461da3a70', // sailfish
  '0x372caf681353758f985597a35266f7b330a2a44d', // shimmerskin
  '0x2493cfdacc0f9c07240b5b1c4be08c62b8eeff69', // silverfin
  '0x66f5bfd910cd83d3766c4b39d13730c911b2d286', // shvasrune
  '0x9678518e04fe02fb30b55e2d0e554e26306d0892', // bluepetegg
  '0x95d02c1dc58f05a015275eb49e107137d9ee81dc', // greypetegg
  '0x6d605303e9ac53c59a3da1ece36c9660c7a71da5', // greenpetegg
  '0x3db1fd0ad479a46216919758144fd15a21c3e93c', // yellowpetegg
  '0xac5c49ff7e813de1947dc74bbb1720c353079ac9', // bluestem
  '0xc0214b37fcd01511e6283af5423cf24c96bb9808', // milkweed
  '0x19b9f05cde7a61ab7aae5b0ed91aa62ff51cf881', // spiderfruit
];
const OTHER_ADDRESSES: GenericObject = {
  NULL_ADDRESS: '0x0000000000000000000000000000000000000000',
  BANK_ADDRESS: '0xa9ce83507d872c5e1273e745abcfda849daa654f',
  DFK_GOLD_ADDRESS: '0x3a4edcf3312f44ef027acfd8c21382a5259936e7',
  JEWEL_ADDRESS: '0x72cb10c6bfa5624dd07ef608027e366bd690048f',
  XJEWEL_ADDRESS: '0xa9ce83507d872c5e1273e745abcfda849daa654f',
  DFK_SHVAS_ADDRESS: '0x66f5bfd910cd83d3766c4b39d13730c911b2d286',
};

export { addrs_to_token, token_to_addrs, decimals, LP_PAIRS, OTHER_LP_PAIRS, QUEST_TOKEN_ADDRESSES, OTHER_ADDRESSES };
