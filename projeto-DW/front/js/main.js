import API from './services/api.js';

// Elementos do formulário
const hostForm = document.getElementById('hostForm');
const hostNameInput = document.getElementById('hostName');
const hostIPInput = document.getElementById('hostIP');
const hostDescriptionInput = document.getElementById('hostDescription');
const hostTypeInput = document.getElementById('hostType');
const hostFabricanteInput = document.getElementById('hostFabricante');
const hostsList = document.getElementById('hostsList');
const hostModal = new bootstrap.Modal(document.getElementById('hostModal'));

// Carrega e renderiza os hosts existentes
async function loadHosts() {
  try {
    const hosts = await API.read('hosts');
    renderHosts(hosts);
  } catch (error) {
    console.error('Erro ao carregar hosts:', error);
  }
}

// Adiciona um novo host
async function addHost(hostData) {
  try {
    const newHost = await API.create('hosts', hostData);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${newHost.name}</td>
      <td>${newHost.ip}</td>
      <td>${newHost.description || '-'}</td>
      <td>${newHost.tipo || '-'}</td>
      <td>${newHost.fabricante || '-'}</td>
      <td>
        <span class="${newHost.status === true ? 'bg-hive-online' : 'bg-hive-offline'}">
          ${newHost.status === true ? 'Online' : 'Offline'}
        </span>
      </td>
    `;
    hostsList.appendChild(row);

    hostForm.reset();
    hostModal.hide();
    console.log('Host adicionado com sucesso:', newHost);
  } catch (error) {
    console.error('Erro ao adicionar host:', error);
    alert('Erro ao adicionar host. Tente novamente.');
  }
}

// Manipulador do envio do formulário
hostForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const selectedStatus = document.querySelector('input[name="hostStatus"]:checked');

  const hostData = {
    name: hostNameInput.value.trim(),
    ip: hostIPInput.value.trim(),
    description: hostDescriptionInput.value.trim(),
    tipo: hostTypeInput.value.trim(),
    fabricante: hostFabricanteInput.value.trim(),
    status: selectedStatus.value === 'true'
  };

  if (!hostData.name || !hostData.ip) {
    alert('Nome e IP são obrigatórios!');
    return;
  }

  await addHost(hostData);
});

// Renderização da tabela
function renderHosts(hosts) {
  const container = document.getElementById("hostsList");
  container.innerHTML = "";

  hosts.forEach(host => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${host.name}</td>
      <td>${host.ip}</td>
      <td>${host.description || '-'}</td>
      <td>${host.tipo || '-'}</td>
      <td>${host.fabricante || '-'}</td>
      <td>
        <span class="${host.status === true ? 'bg-hive-online' : 'bg-hive-offline'}">
          ${host.status === true ? 'Online' : 'Offline'}
        </span>
      </td>
    `;
    container.appendChild(row);
  });
}

loadHosts();
