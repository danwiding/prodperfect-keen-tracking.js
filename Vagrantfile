Vagrant.configure('2') do |config|

  # https://docs.google.com/document/d/1Ty_1ffQCaJwLA-lYgc0_r707QnEH3Jwb1TErN9ZzBzE/edit

  hostname = 'base.box'
  gui = true

  # Box
  config.vm.box = 'bento/ubuntu-16.04'
  config.vm.hostname = hostname

  config.vm.synced_folder '.', '/vagrant', type: 'rsync', id: 'root', rsync__exclude: ['dist', 'node_modules']
  config.vm.synced_folder './dist', '/vagrant/dist', type: 'nfs', id: 'dist'

  config.ssh.forward_agent = true

  config.vm.provider 'virtualbox' do |vb|
    vb.gui = gui
    vb.customize [
      'modifyvm', :id,
      '--accelerate3d', 'on',
      '--memory', ENV['VAGRANT_RAM_MB'] || '4096',
      '--cpus', ENV['VAGRANT_CPU_COUNT'] || '3',
      '--nictype1', 'virtio',
      '--nictype2', 'virtio',
      '--natdnshostresolver1', 'on',
      '--natdnsproxy1', 'on',
      '--vram', '256',
      '--graphicscontroller', 'vboxvga',
      '--ioapic', 'on',
      '--hwvirtex', 'on'
    ]
  end

  config.vm.provider "vmware_fusion" do |v|
    v.gui = gui
    v.vmx["memsize"] = "1024"
    v.vmx["numvcpus"] = "2"
  end

  config.vm.provision :chef_solo, run: "always" do |chef|
    chef.add_recipe 'apt'
    chef.add_recipe 'nodejs'
    chef.add_recipe 'oh_my_zsh'
    chef.add_recipe 'sysstat'
    chef.add_recipe 'vim'

    chef.json = {
      oh_my_zsh: {
        users: [{
          login: 'vagrant',
          plugins: [''],
        }
        ]
      }
    }

  end
  config.vm.provision :shell, path: "provisioning.sh", run: "once"
end
