# Snappi

<img src="http://i.imgur.com/kWuIxtl.png" alt="Snappi screen" title="Snappi" align="right" width="400" />
<img src="http://i.imgur.com/PQoobPb.png" alt="Snappi screen" title="Snappi" align="right" width="400" />

A Snap "Software Centre" style desktop UI for snap packages.

**Features:**

 - Search, Install and manage your snaps in a desktop UI.
 
 Still a WIP, so more features and bug fixes to come.



## Downloads

| File | Description | Platform | Format |
| --- | --- | --- | --- |
| [...](...) | 0.0.1 - [Release Notes](...) | Linux | AppImage |
| [...](...) | 0.0.1 - [Release Notes](...) | Linux | Snap |

Installing & Running:

 - `AppImage` - Simply run it.
 - `Snap` - Download the .snap and then install it:
   - `snap install snap-ui_0.0.1_amd64.snap --dangerous --classic`

As versions are released, they will be posted here: [https://github.com/lcherone/Snappi/releases](https://github.com/lcherone/Snappi/releases) 
which you can just download and run. Or you can build as shown below. Windows or mac its not supported.

#### Why is it not on the snap store (snapcraft)?

It maybe in the future, but from my initial experiance its not been easy to publish it, at every step of the way ive needed to be "reviewed", and seems like only 3 or 4 "god mode" forum users decide if it's ok.

 - Not allowed the name snappi as its "reserved", (pending review), happy to change it.
 - Initial upload failed, because using classic mode (pending review).
 
 Will post here on any updates.


### Build Setup

``` bash
# download source
git clone git@github.com:lcherone/Snappi.git && cd lxd-ui

# install dependencies
npm install

# build application - built app will be in: ./build
npm run build
```

### Developer Setup

``` bash
# download source
git clone git@github.com:lcherone/Snappi.git && cd lxd-ui

# install dependencies
npm install

# serve with hot reload
npm run dev
```

## Developer Support / Sponsor

If you enjoy using this app and want to show your appreciation,
please feel free to make a donation [https://www.paypal.me/lcherone](https://www.paypal.me/lcherone), thanks.
