sudo apt-get update
# sudo apt-get install \
#     apt-transport-https \
#     ca-certificates \
#     curl \
#     software-properties-common \
#     python-software-properties

# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# to install docker properly
sudo gpg --keyserver keyserver.ubuntu.com --recv-key 7638D0442B90D010
gpg -a --export 7638D0442B90D010 | sudo apt-key add -
sudo gpg --keyserver keyserver.ubuntu.com --recv-key 8B48AD6246925553
gpg -a --export 8B48AD6246925553 | sudo apt-key add -
sudo apt-get install --no-install-recommends lubuntu-desktop -y
# sudo apt-get update
# apt-cache policy docker-ce
# sudo apt-get install -y docker-ce

# https://stackoverflow.com/questions/18878117/using-vagrant-to-run-virtual-machines-with-desktop-environment
#sudo apt-get install -y xfce4
# sudo startxfce4&


sudo apt-get install -y python-pip python-dev build-essential
sudo pip install --upgrade pip

# https://docs.aws.amazon.com/cli/latest/userguide/installing.html
# pip install awscli --upgrade --user

# to get copy and paste going
#sudo apt-get install open-vm-tools open-vm-tools-desktop
