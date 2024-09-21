import {defineHook} from '@directus/extensions-sdk';

export default defineHook(({embed}, {env}) => {
    embed(
        'body',
        () => {
            return `
<div class="loader-wrapper">
    <div id="gitea-run-status" class="loader-line"></div>
</div>
<style>
.loader-wrapper {
    height: 5px;
    width: 100%;
    position: absolute;
    top: 0;
    overflow: hidden;
    z-index: 100;
}
.loader-line {
    height: 5px;
    width: 100%;
    background-color: #ddd;
    border-radius: 20px;
    z-index: 100;
}

.loader-line:before {
    content: "";
    position: absolute;
    left: -50%;
    height: 5px;
    width: 40%;
    border-radius: 20px;
    background-color: #ddd;
}

.loader-line.pending {
    animation: lineAnim 2s linear infinite;
    background-color: var(--primary);
}

.loader-line.success {
    background-color: var(--primary);
    animation: fadeOut 3s linear forwards;
}

.loader-line.failure {
    background-color: var(--danger);
    animation: lineAnim 2s linear infinite;
}

@keyframes lineAnim {
    0% {
        left: 0;
        width: 10%;
    }
    50% {
        left: 20%;
        width: 60%;
    }
    100% {
        left: 100%;
        width: 100%;
    }
}
@keyframes fadeOut {
    0% { opacity: 1;}
    99% { opacity: 0.01;}
    100% { opacity: 0;}
}

@keyframes blink {
    0% { opacity: 1;}
    50% { opacity: 0.35;}
    100% { opacity: 0.7;}
}
</style>
<script>
parseStatus = function(buildData) {
    if (buildData.getNamedItem('activity').value === "Building") {
        return 'in-progress';
    }
    
    let lastBuildStatus = buildData.getNamedItem('lastBuildStatus').value;
    if (lastBuildStatus === 'Success') {
        return 'success';
    }
    
    return 'failed';
}

getRefCommitStatus = async function() {
    const response = await fetch('${env.GITEA_URL}/api/v1/repos/${env.GITEA_REPO_OWNER}/${env.GITEA_REPO_NAME}/commits/${env.GITEA_REPO_BRANCH}/status?page=1&limit=15&access_token=${env.GITEA_TOKEN}');
    return await response.json();
}

showStatus = async function(elem) {
    const refCommitStatus = await getRefCommitStatus();
    const buildStatus = refCommitStatus.state;
    
    elem.classList.add(buildStatus);
    if(buildStatus === 'pending') {
        elem.classList.remove('success');
        elem.classList.remove('failure');
    } else if(buildStatus === 'success') {
        elem.classList.remove('failure');
        elem.classList.remove('pending');
    } else if (buildStatus === 'failure') {
        elem.classList.remove('success');
        elem.classList.remove('pending');
    }
}
const loadingLine = document.getElementById('gitea-run-status');
setInterval(() => {
    showStatus(loadingLine);
}, 2000)
</script>
`
        }
    );
});
