# solc-vm - Solidity Compiler Version Manager

`solc-vm` allows us to manage solidity compiler (solc) and compile sol files from the tool directly with specific compiler version.

## Prerequisites
- NodeJS (Tested with Version 8.x.x)
- NPM (Tested with Version 6.x.x)

## Installation
Ideally, this project needs to be published on npm. But at development phase, we can install directly from the folder.

### Windows:
```
cd solc-vm
npm install -g .
```

### Linux:
```
chmod 777 solc-vm/
cd solc-vm
sudo npm install -g .
```

### Mac Os:
We have different way to install this tool on Mac OS. The tool needs to be compiled directly.

#### Prerequisites
- `cmake`
- `boost`
- `z3`

Make sure to have the prerequisites installed. If we need to install them, the best way is to use `Homebrew`:
```
brew install cmake
brew install boost
brew install z3
```

#### Install `solc-vm`
```
chmod 777 solc-vm/
cd solc-vm
sudo npm install -g .
```


Make sure to add `.` (dot) at the end of command or you can define it with specific package folder.

For Linux OS and Mac OS, we need to allow write access to the folder `chmod 777 solc-vm/`. This is required since `npm` need access to the folder while installing. This step is `NOT` required if we've published this tool.

## Usage

Once the installation success, we can use the command line `solc-vm` globally.

#### Install specific version
```
solc-vm install x.y.z
```
#### Uninstall specific version
```
solc-vm uninstall x.y.z
```
#### List installed versions
```
solc-vm ls
```
#### Compile with specific version (Print ABI and binary)
```
solc-vm using x.y.z file.sol --abi --bin
```

#### Show solc help
```
solc-vm using x.y.z --help
```

We can add any solc arguments and params to `solc-vm`.

## Development

Install dependencies:
```
npm install
```

### Lint and testing

The tool uses `semistandard` to lint the project. We can lint using command:
```
npm run lint
```

Testing this tool is done by `tape`. To test this project, we can use the following command:
```
npm test
```

## Video demo
https://drive.google.com/open?id=13DoCLjPixLxMyJw3XaJTvP8tpIGfXrOQ

##### Mac OS
https://drive.google.com/open?id=1-56HJfran-zduWzENIC3hQT1Tsk0psN4

Please notice that the video paused while compiling since it takes a lot of time. 