// Microsoft Certification Paths Data
// Each path represents a track with stations (certifications)
// Certifications can be grouped into named branches (tracks) within each path

import { careerRoles } from './careerRoles.js';

export const CERT_LEVELS = {
  FUNDAMENTALS: 'Fundamentals',
  ASSOCIATE: 'Associate',
  EXPERT: 'Expert',
  SPECIALTY: 'Specialty',
};

export const CERT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NEEDS_RENEWAL: 'needs_renewal',
};

export const doesCertExpire = (level) => {
  return [CERT_LEVELS.ASSOCIATE, CERT_LEVELS.EXPERT, CERT_LEVELS.SPECIALTY].includes(level);
};

export const PILLARS = {
  CLOUD_AI: 'Cloud & AI Platforms',
  BIZ_SOLUTIONS: 'AI Business Solutions',
  SECURITY: 'Security',
  RETIRED: 'Retired & Archived',
};

export const certificationPaths = [
  {
    id: 'azure-infrastructure',
    name: 'Azure Apps & Infrastructure',
    shortName: 'Azure Infrastructure',
    code: 'AZ',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-azure)',
    glowColor: 'var(--glow-azure)',
    cssVar: '--line-azure',
    icon: 'Cloud',
    description: 'Cloud administration, networking, and architecture for Azure infrastructure.',
    branches: [
      { id: 'admin', name: 'Admin', description: 'Core infrastructure administration' },
      { id: 'developer', name: 'Developer', description: 'Cloud application development' },
      { id: 'networking', name: 'Networking', description: 'Azure networking infrastructure' },
      { id: 'hybrid', name: 'Hybrid', description: 'Hybrid and multi-cloud solutions' },
      { id: 'specialty-sap', name: 'SAP Specialty', description: 'SAP workloads on Azure' },
      { id: 'specialty-vdi', name: 'VDI Specialty', description: 'Virtual Desktop Infrastructure' },
    ],
    certifications: [
      {
        id: 'az-900',
        examCode: 'AZ-900',
        name: 'Azure Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe cloud concepts (25–30%)',
        'Describe Azure architecture and services (35–40%)',
        'Describe Azure management and governance (30–35%)'
        ],
      },
      {
        id: 'az-802',
        examCode: 'AZ-802',
        name: 'Windows Server Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'hybrid',
        description: 'Deploy, implement, manage, secure, and troubleshoot Windows Server across on-premises, cloud, and hybrid environments.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-802/',
        retirementDate: null,
        isBeta: 'Beta from July 2026',
        skillsMeasured: [
        'Deploy and manage Active Directory Domain Services (AD DS)',
        'Manage Windows Server instances and workloads in a hybrid environment',
        'Manage virtual machines (VMs)',
        'Implement and manage an on-premises and hybrid networking infrastructure',
        'Manage storage and file services',
        'Secure Windows Server infrastructure',
        'Monitor and troubleshoot Windows Server environments'
        ],
      },
      {
        id: 'az-700',
        examCode: 'AZ-700',
        name: 'Azure Network Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'networking',
        description: 'Demonstrate the design, implementation, and maintenance of Azure networking infrastructure, load balancing traffic, network routing, and more. ',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-700/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement core networking infrastructure (25–30%)',
        'Design, implement, and manage connectivity services (20–25%)',
        'Design and implement application delivery services (15–20%)',
        'Design and implement private access to Azure services (10–15%)',
        'Design and implement Azure network security services (15–20%)'
        ],
      },
      {
        id: 'az-104',
        examCode: 'AZ-104',
        name: 'Azure Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'admin',
        description: 'Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/',
        retirementDate: null,
        skillsMeasured: [
        'Manage Azure identities and governance (20–25%)',
        'Implement and manage storage (15–20%)',
        'Deploy and manage Azure compute resources (20–25%)',
        'Implement and manage virtual networking (15–20%)',
        'Monitor and maintain Azure resources (10–15%)'
        ],
      },
      {
        id: 'az-305',
        examCode: 'AZ-305',
        name: 'Azure Solutions Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'admin',
        description: 'Design infrastructure, identity, data, business continuity, and application solutions on Azure.',
        prerequisites: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-305/',
        retirementDate: null,
        skillsMeasured: [
        'Design identity, governance, and monitoring solutions (25–30%)',
        'Design data storage solutions (20–25%)',
        'Design business continuity solutions (15–20%)',
        'Design infrastructure solutions (30–35%)'
        ],
      },
      {
        id: 'az-120',
        examCode: 'AZ-120',
        name: 'Azure for SAP Workloads Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-sap',
        description: 'Demonstrate planning, migration, and operation of an SAP solution on Microsoft Azure while you leverage Azure resources.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-120/',
        retirementDate: null,
        skillsMeasured: [
        'Migrate SAP workloads to Azure (25–30%)',
        'Design and implement an infrastructure to support SAP workloads on Azure (25–30%)',
        'Design and implement high availability and disaster recovery (HADR) (20–25%)',
        'Maintain SAP workloads on Azure (20–25%)'
        ],
      },
      {
        id: 'az-140',
        examCode: 'AZ-140',
        name: 'Azure Virtual Desktop Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-vdi',
        description: 'Plan, deliver, manage, and monitor virtual desktop experiences and remote apps on Microsoft Azure for any device.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-140/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and implement an Azure Virtual Desktop infrastructure (40–45%)',
        'Plan and implement identity and security (15–20%)',
        'Plan and implement user environments and apps (20–25%)',
        'Monitor and maintain an Azure Virtual Desktop infrastructure (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'ai-machine-learning',
    name: 'Artificial Intelligence',
    shortName: 'Artificial Intelligence',
    code: 'AI',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-ai)',
    glowColor: 'var(--glow-ai)',
    cssVar: '--line-ai',
    icon: 'Brain',
    description: 'Build and deploy AI solutions, intelligent agents, and machine learning operations.',
    branches: [
      { id: 'cloud-ai', name: 'Cloud AI', description: 'Cloud-based AI solutions' },
      { id: 'apps-agents', name: 'Apps & Agents', description: 'Intelligent apps and AI agents' },
      { id: 'mlops', name: 'MLOps', description: 'Machine learning operations' },
    ],
    certifications: [
      {
        id: 'ai-901',
        examCode: 'AI-901',
        name: 'Azure AI Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Foundational knowledge of machine learning, computer vision, NLP, and generative AI on Azure.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-901/',
        retirementDate: null,
        skillsMeasured: [
        'Identify AI concepts and responsibilities (40–45%)',
        'Implement AI solutions by using Microsoft Foundry (55–60%)'
        ],
      },
      {
        id: 'ai-200',
        examCode: 'AI-200',
        name: 'Azure AI Cloud Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'cloud-ai',
        description: 'This certification validates your ability to design, build, and implement AI solutions on Azure, with a focus on back‑end services, scalable architectures, and the full development lifecycle.',
        prerequisites: [],
        recommendedPrereqs: ['ai-901'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-200/',
        retirementDate: null,
        skillsMeasured: [
        'Azure SDKs and third-party SDKs used in Azure.',
        'Azure data management services.',
        'Azure monitoring and troubleshooting.',
        'Azure messaging and eventing.',
        'Vector databases.',
        'Python programming.',
        'Implementing containerized applications on Azure.'
        ],
      },
      {
        id: 'ai-103',
        examCode: 'AI-103',
        name: 'Azure AI App & Agent Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'apps-agents',
        description: 'This certification validates your expertise in designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry.',
        prerequisites: [],
        recommendedPrereqs: ['ai-901'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and manage an Azure AI solution (25–30%)',
        'Implement generative AI and agentic solutions (30–35%)',
        'Implement computer vision solutions (10–15%)',
        'Implement text analysis solutions (10–15%)',
        'Implement information extraction solutions (10–15%)'
        ],
      },
      {
        id: 'ai-300',
        examCode: 'AI-300',
        name: 'Machine Learning Operations Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'mlops',
        description: 'Demonstrate skills setting up infrastructure for machine learning operations (MLOps) and generative AI operations (GenAIOps) solutions on Azure, together referred to as AI operations (AIOps).',
        prerequisites: [],
        recommendedPrereqs: ['ai-200'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-300/',
        retirementDate: null,
        skillsMeasured: [
        'Machine Learning.',
        'Foundry.',
        'GitHub Actions.',
        'Infrastructure as code (IaC) practices with Bicep and Azure CLI.'
        ],
      },
      {
        id: 'ai-500',
        examCode: 'AI-500',
        name: 'Multi-Agent AI Solutions Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'apps-agents',
        description: 'Design, build, orchestrate, govern, and optimize scalable, production-ready multi-agent AI solutions and workflows.',
        prerequisites: ['ai-103'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-500/',
        retirementDate: null,
        isBeta: 'Beta from July 2026',
        skillsMeasured: [
        'Design logical architecture for multi-agent solutions',
        'Build and integrate tool ecosystems',
        'Implement multi-agent orchestration',
        'Evaluate, optimize, and monitor multi-agent solutions',
        'Secure, govern, and deploy multi-agent solutions'
        ],
      },
    ],
  },
  {
    id: 'data-engineering',
    name: 'Data Platform',
    shortName: 'Data Platform',
    code: 'DP',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-data)',
    glowColor: 'var(--glow-data)',
    cssVar: '--line-data',
    icon: 'Database',
    description: 'Design and implement data solutions, analytics pipelines, and database systems.',
    branches: [
      { id: 'engineering', name: 'Engineering', description: 'Data integration and pipelines' },
      { id: 'analytics', name: 'Analytics', description: 'Data modeling and visualization' },
      { id: 'admin', name: 'Database Admin', description: 'Database management and security' },
      { id: 'specialty-cosmos', name: 'Cosmos DB Specialty', description: 'NoSQL database solutions' },
    ],
    certifications: [
      {
        id: 'dp-900',
        examCode: 'DP-900',
        name: 'Azure Data Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of core data concepts related to Microsoft Azure data services.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/',
        retirementDate: null,
        skillsMeasured: [
        'Describe core data concepts (25–30%)',
        'Identify considerations for relational data on Azure (20–25%)',
        'Describe considerations for working with non-relational data on Azure (15–20%)',
        'Describe an analytics workload on Azure (25–30%)'
        ],
      },
            {
        id: 'dp-700',
        examCode: 'DP-700',
        name: 'Fabric Data Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'As a Fabric Data Engineer, you should have subject matter expertise with data loading patterns, data architectures, and orchestration processes.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer/',
        retirementDate: null,
        skillsMeasured: [
        'Implement and manage an analytics solution (30–35%)',
        'Ingest and transform data (30–35%)',
        'Monitor and optimize an analytics solution (30–35%)'
        ],
      },
      {
        id: 'dp-750',
        examCode: 'DP-750',
        name: 'Azure Databricks Data Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'Build scalable, secure data pipelines for AI and analytics using Azure Databricks.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-databricks-data-engineer-associate/',
        retirementDate: null,
        isNew: true,
        skillsMeasured: [
        'Set up and configure an Azure Databricks environment (15–20%)',
        'Secure and govern Unity Catalog objects (15–20%)',
        'Prepare and process data (30–35%)',
        'Deploy and maintain data pipelines and workloads (30–35%)'
        ],
      },
      {
        id: 'dp-800',
        examCode: 'DP-800',
        name: 'SQL AI Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'engineering',
        description: 'Design and develop AI-integrated database solutions across Microsoft SQL platforms, including SQL Server, Azure SQL, and databases in Microsoft Fabric.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/sql-ai-developer-associate/',
        retirementDate: null,
        isNew: true,
        skillsMeasured: [
        'Design and develop database solutions (35–40%)',
        'Secure, optimize, and deploy database solutions (35–40%)',
        'Implement AI capabilities in database solutions (25–30%)'
        ],
      },
      {
        id: 'dp-300',
        examCode: 'DP-300',
        name: 'Azure Database Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'admin',
        description: 'Administer an SQL Server database infrastructure for cloud, on-premises and hybrid relational databases using the Microsoft PaaS relational database offerings.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-300/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and implement data platform resources (15–20%)',
        'Implement a secure environment (20–25%)',
        'Monitor, configure, and optimize database resources (20–25%)',
        'Configure and manage automation of tasks (15–20%)',
        'Plan and configure a high availability and disaster recovery (HA/DR) environment (20–25%)'
        ],
      },
      {
        id: 'dp-600',
        examCode: 'DP-600',
        name: 'Fabric Analytics Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'analytics',
        description: 'As a Fabric analytics engineer associate, you should have subject matter expertise in designing, creating, and deploying enterprise-scale data analytics solutions.',
        prerequisites: [],
        recommendedPrereqs: ['dp-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-600/',
        retirementDate: null,
        skillsMeasured: [
        'Maintain a data analytics solution (25–30%)',
        'Prepare data (45–50%)',
        'Implement and manage semantic models (25–30%)'
        ],
      },
      {
        id: 'dp-420',
        examCode: 'DP-420',
        name: 'Azure Cosmos DB Developer Specialty',
        level: CERT_LEVELS.SPECIALTY,
        branch: 'specialty-cosmos',
        description: 'Write efficient queries, create indexing policies, manage, and provision resources in the SQL API and SDK with Microsoft Azure Cosmos DB.',
        prerequisites: [],
        recommendedPrereqs: ['dp-700'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-420/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement data models (35–40%)',
        'Design and implement data distribution (5–10%)',
        'Integrate an Azure Cosmos DB solution (5–10%)',
        'Optimize an Azure Cosmos DB solution (15–20%)',
        'Maintain an Azure Cosmos DB solution (25–30%)'
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Security, Compliance, and Identity',
    shortName: 'Security',
    code: 'SC',
    pillar: PILLARS.SECURITY,
    color: 'var(--line-security)',
    glowColor: 'var(--glow-security)',
    cssVar: '--line-security',
    icon: 'Shield',
    description: 'Secure cloud environments, manage identity, and protect AI systems.',
    branches: [
      { id: 'cloud-security', name: 'Cloud Security', description: 'Cloud infrastructure protection' },
      { id: 'operations', name: 'SecOps', description: 'Security operations and threat hunting' },
      { id: 'identity', name: 'Identity', description: 'Identity and access management' },
      { id: 'info-sec', name: 'Info Security', description: 'Information protection and compliance' },
    ],
    certifications: [
      {
        id: 'sc-900',
        examCode: 'SC-900',
        name: 'Security, Compliance & Identity Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge on security, compliance, and identity concepts and related cloud-based Microsoft solutions.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe the concepts of security, compliance, and identity (10–15%)',
        'Describe the capabilities of Microsoft Entra (25–30%)',
        'Describe the capabilities of Microsoft security solutions (35–40%)',
        'Describe the capabilities of Microsoft compliance solutions (20–25%)'
        ],
      },
      {
        id: 'sc-500',
        examCode: 'SC-500',
        name: 'Cloud & AI Security Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'cloud-security',
        description: 'This certification validates your ability to design, implement, and manage end‑to‑end security controls across Azure, hybrid, and AI-enabled environments to protect identities, data, applications, infrastructure, and maintain regulatory compliance.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/cloud-and-ai-security-engineer-associate/?wt.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        isBeta: true,
        skillsMeasured: [
        'Securing access to resources by using Microsoft Entra ID and Azure Key Vault.',
        'Enforcing security and regulatory compliance.',
        'Securing storage, databases, and networking.',
        'Securing compute.',
        'Securing AI solutions.',
        'Managing and monitoring security posture.'
        ],
      },
      {
        id: 'sc-100',
        examCode: 'SC-100',
        name: 'Cybersecurity Architect Expert',
        level: CERT_LEVELS.EXPERT,
        description: 'Design and evolve the cybersecurity strategy for an organization.',
        prerequisites: [['sc-200', 'sc-300', 'sc-500']], // Requires ONE OF these
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-100/',
        retirementDate: null,
        skillsMeasured: [
        'Design solutions that align with security best practices and priorities (20–25%)',
        'Design security operations, identity, and compliance capabilities (25–30%)',
        'Design security solutions for infrastructure (25–30%)',
        'Design security solutions for applications and data (20–25%)'
        ],
      },

      {
        id: 'sc-200',
        examCode: 'SC-200',
        name: 'Security Operations Analyst Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'operations',
        description: 'Investigate, search for, and mitigate threats using Microsoft Sentinel, Microsoft Defender for Cloud, and Microsoft 365 Defender.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-200/',
        retirementDate: null,
        skillsMeasured: [
        'Manage a security operations environment (40–45%)',
        'Respond to security incidents (35–40%)',
        'Perform threat hunting (20–25%)'
        ],
      },
      {
        id: 'sc-300',
        examCode: 'SC-300',
        name: 'Identity and Access Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'identity',
        description: 'Demonstrate the features of Microsoft Entra ID to modernize identity solutions, implement hybrid solutions, and implement identity governance.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-300/',
        retirementDate: null,
        skillsMeasured: [
        'Implement and manage user identities (20–25%)',
        'Implement authentication and access management (25–30%)',
        'Plan and implement workload identities (20–25%)',
        'Plan and automate identity governance (20–25%)'
        ],
      },
      {
        id: 'sc-401',
        examCode: 'SC-401',
        name: 'Information Security Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'info-sec',
        description: 'As an Information Security Administrator, you plan and implement information security of sensitive data by using Microsoft Purview and related services.',
        prerequisites: [],
        recommendedPrereqs: ['sc-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/sc-401/',
        retirementDate: null,
        skillsMeasured: [
        'Implement information protection (30–35%)',
        'Implement data loss prevention and retention (30–35%)',
        'Manage risks, alerts, and activities (30–35%)'
        ],
      },

    ],
  },
  {
    id: 'microsoft-365',
    name: 'Modern Workplace',
    shortName: 'Modern Workplace',
    code: 'MS',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-m365)',
    glowColor: 'var(--glow-m365)',
    cssVar: '--line-m365',
    icon: 'Monitor',
    description: 'Administer, secure, and optimize Microsoft 365 and modern workplace solutions.',
    branches: [
      { id: 'admin', name: 'Admin', description: 'Tenant administration and services' },
      { id: 'endpoint', name: 'Endpoint', description: 'Device management and deployment' },
      { id: 'messaging', name: 'Messaging', description: 'Exchange and messaging solutions' },
      { id: 'teams', name: 'Teams', description: 'Collaboration and communication' },
      { id: 'collab', name: 'Collaboration', description: 'Collaboration communications systems' },
    ],
    certifications: [
      {
        id: 'ms-102',
        examCode: 'MS-102',
        name: 'Microsoft 365 Administrator',
        level: CERT_LEVELS.EXPERT,
        description: 'Deploy, configure, and manage Microsoft 365 tenants including identity, security, and compliance.',
        prerequisites: [['md-102', 'ms-700', 'sc-300', 'sc-401']],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-102/',
        retirementDate: '2026-10-31',
        skillsMeasured: [
        'Deploy and manage a Microsoft 365 tenant (25–30%)',
        'Implement and manage Microsoft Entra identity and access (25–30%)',
        'Manage security and threats by using Microsoft Defender XDR (30–35%)',
        'Manage compliance by using Microsoft Purview (10–15%)'
        ],
      },
      {
        id: 'md-102',
        examCode: 'MD-102',
        name: 'Endpoint Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'endpoint',
        description: 'Plan and execute an endpoint deployment strategy, using essential elements of modern management, co-management approaches, and Microsoft Intune integration.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/md-102/',
        retirementDate: null,
        skillsMeasured: [
        'Prepare infrastructure for devices (25–30%)',
        'Manage and maintain devices (30–35%)',
        'Manage applications (15–20%)',
        'Protect devices (15–20%)'
        ],
      },
      {
        id: 'ms-700',
        examCode: 'MS-700',
        name: 'Teams Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'teams',
        description: 'Demonstrate skills to plan, deploy, configure, and manage Microsoft Teams to focus on efficient and effective collaboration and communication in a Microsoft 365 environment. ',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-700/',
        retirementDate: null,
        skillsMeasured: [
        'Configure and manage a Teams environment (40–45%)',
        'Manage teams, channels, chats, and apps (20–25%)',
        'Manage meetings and calling (15–20%)',
        'Monitor, report on, and troubleshoot Teams (15–20%)'
        ],
      },
      {
        id: 'ms-721',
        examCode: 'MS-721',
        name: 'Collaboration Communications Systems Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'collab',
        description: 'Demonstrate skills to configure, deploy, monitor, and manage Microsoft Teams Phone, meetings, and certified devices.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-721/',
        retirementDate: null,
        skillsMeasured: [
        'Plan and design collaboration communications systems (20–25%)',
        'Configure and manage Teams meetings, webinars, and town halls (15–20%)',
        'Configure and manage Teams Phone (30–35%)',
        'Configure and manage Teams Rooms and devices (20–25%)'
        ],
      },
    ],
  },
  {
    id: 'power-platform',
    name: 'Business Applications',
    shortName: 'Business Apps',
    code: 'PL',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-power)',
    glowColor: 'var(--glow-power)',
    cssVar: '--line-power',
    icon: 'Zap',
    description: 'Build low-code applications, automate workflows, and analyze data with Power Platform.',
    branches: [
      { id: 'functional', name: 'Functional', description: 'Solution architecture and consulting' },
      { id: 'developer', name: 'Developer', description: 'Custom extensions and integrations' },
      { id: 'analyst', name: 'Analyst', description: 'Data analysis and visualization' },
      { id: 'rpa', name: 'RPA', description: 'Robotic process automation' },
    ],
    certifications: [
      {
        id: 'pl-900',
        examCode: 'PL-900',
        name: 'Power Platform Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate the business value and product capabilities of Microsoft Power Platform, such as Power Apps, data connections with Dataverse, and Power Automate.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe the business value of Microsoft Power Platform (15–20%)',
        'Manage the Microsoft Power Platform environment (15–20%)',
        'Demonstrate the capabilities of Power Apps (25–30%)',
        'Demonstrate the capabilities of Power Automate (15–20%)',
        'Demonstrate the capabilities of Power Pages (10–15%)'
        ],
      },
      {
        id: 'pl-300',
        examCode: 'PL-300',
        name: 'Power BI Data Analyst Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'analyst',
        description: 'Demonstrate methods and best practices that align with business and technical requirements for modeling, visualizing, and analyzing data with Microsoft Power BI.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-300/',
        retirementDate: null,
        skillsMeasured: [
        'Prepare the data (25–30%)',
        'Model the data (25–30%)',
        'Visualize and analyze the data (25–30%)',
        'Manage and secure Power BI (15–20%)'
        ],
      },
      {
        id: 'pl-400',
        examCode: 'PL-400',
        name: 'Power Platform Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'developer',
        description: 'Demonstrate how to simplify, automate, and transform business tasks and processes using Microsoft Power Platform Developer.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-400/',
        retirementDate: null,
        skillsMeasured: [
        'Create a technical design (10–15%)',
        'Build Power Platform solutions (10–15%)',
        'Implement Power Apps improvements (10–15%)',
        'Extend the user experience (10–15%)',
        'Extend the platform (30–35%)',
        'Develop integrations (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'agentic-ai',
    name: 'AI Business Solutions',
    shortName: 'AI Business',
    code: 'AB',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-agentic)',
    glowColor: 'var(--glow-agentic)',
    cssVar: '--line-agentic',
    icon: 'Bot',
    description: 'Build and architect AI-powered business solutions with Copilot and autonomous agents.',
    branches: [
      { id: 'admin', name: 'Admin', description: 'AI services administration' },
      { id: 'sales', name: 'Sales', description: 'AI solutions for sales processes' },
      { id: 'contact-center', name: 'Contact Center', description: 'AI-powered contact centers' },
      { id: 'builder', name: 'Agent Builder', description: 'Custom AI agent development' },
      { id: 'supply-chain', name: 'Supply Chain', description: 'AI solutions for supply chain' },
    ],
    certifications: [
      {
        id: 'ab-650',
        examCode: 'AB-650',
        name: 'AI Services Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'admin',
        description: 'Manage and secure AI services within Microsoft 365, including Copilot and related data sources.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-services-administrator-associate/',
        retirementDate: null,
        isBeta: 'Beta from July 2026',
        skillsMeasured: [
        'Implement and manage Copilot in Microsoft 365',
        'Secure AI data and services',
        'Monitor and troubleshoot AI adoption and performance'
        ],
      },
      {
        id: 'ab-620',
        examCode: 'AB-620',
        name: 'AI Agent Builder Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'builder',
        description: 'Design, build, and deploy custom AI agents using Microsoft Copilot Studio and Power Platform.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-agent-builder-associate/',
        retirementDate: null,
        skillsMeasured: [
        'Design an AI agent solution',
        'Build and configure AI agents',
        'Manage and deploy AI agents'
        ],
      },
      {
        id: 'ab-330',
        examCode: 'AB-330',
        name: 'Supply Chain Management AI Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'supply-chain',
        description: 'Design and implement AI-enhanced supply chain management solutions in Dynamics 365.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/',
        retirementDate: null,
        isBeta: 'Beta from Nov 2026',
        skillsMeasured: [
        'Configure Dynamics 365 Supply Chain core features',
        'Implement AI-powered supply chain insights',
        'Deploy and monitor AI agents in supply chain workflows'
        ],
      },
      {
        id: 'ab-900',
        examCode: 'AB-900',
        name: 'Copilot & Agent Admin Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate how to support, secure, and protect an AI-enabled Microsoft 365 environment.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-900/',
        retirementDate: null,
        skillsMeasured: [
        'Identify the core features and objects of Microsoft 365 services (30–35%)',
        'Understand data protection and governance tasks for Microsoft 365 and Copilot (35–40%)',
        'Perform basic administrative tasks for Copilot and agents (25–30%)'
        ],
      },
      {
        id: 'ab-210',
        examCode: 'AB-210',
        name: 'Dynamics 365 Sales AI Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'sales',
        description: 'This certification validates your ability to design and implement AI‑enhanced sales solutions in Dynamics 365 Sales that support intelligent seller workflows across the lead‑to‑cash process.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-210/',
        retirementDate: null,
        skillsMeasured: [
        'Configure Dynamics 365 Sales core features.',
        'Deploy, manage, and monitor agents in Sales.',
        'Implement collaboration features.',
        'Tailor AI-powered intelligence features.'
        ],
      },
      {
        id: 'ab-250',
        examCode: 'AB-250',
        name: 'Dynamics 365 Contact Center AI Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'contact-center',
        description: 'Design and deploy AI-powered contact center solutions with autonomous agents.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/dynamics-365-contact-center-ai-engineer-associate/',
        retirementDate: null,
        skillsMeasured: [
        'Configuring workstreams and engagement channels.',
        'Designing, managing, and implementing routing strategies.',
        'Configuring service representative profiles and experiences.',
        'Enabling productivity tools, including Microsoft Copilot–assisted guidance.',
        'Implementing and managing agents for customer self-service.',
        'Identifying implementation opportunities for and managing service-oriented autonomous agents.',
        'Working with Dynamics 365 Contact Center tools for continuous improvement.',
        'Monitoring and resolving operational issues identified in the contact center.',
        'Configuring proactive engagement capabilities, including outbound dial modes and journey orchestration.',
        'Configuring workforce management capabilities, including demand forecasting, scheduling, and skills alignment.'
        ],
        isBeta: true,
      },
      {
        id: 'ab-410',
        examCode: 'AB-410',
        name: 'Intelligent Applications Builder Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'builder',
        description: 'This certification validates your ability to design, build, and implement AI-powered solutions using Microsoft Power Platform, leveraging Copilot, low-code tools, and integrated data experiences.',
        prerequisites: [],
        recommendedPrereqs: ['ab-900'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/intelligent-applications-builder-associate/?wt.mc_id=credentials_AB410_blog_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Developing Dataverse data models, model-driven apps, and canvas apps.',
        'Integrating agents and Copilot features into canvas apps, model-driven apps, and Power Pages sites.',
        'Creating cloud flows and business logic.'
        ],
      },
      {
        id: 'ab-730',
        examCode: 'AB-730',
        name: 'AI Business Professional',
        level: CERT_LEVELS.FUNDAMENTALS,
        isIndependent: true,
        description: 'Use generative AI productivity tools and Microsoft 365 applications to enhance business outcomes, drafting, and decision-making.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-business-professional/',
        retirementDate: null,
        skillsMeasured: [
        'Understand generative AI fundamentals (25–30%)',
        'Manage prompts and conversations by using AI (35–40%)',
        'Draft and analyze business content by using AI (25–30%)'
        ],
      },
      {
        id: 'ab-731',
        examCode: 'AB-731',
        name: 'AI Transformation Leader',
        level: CERT_LEVELS.FUNDAMENTALS,
        isIndependent: true,
        description: 'Guide AI transformation, adoption, and strategic innovation with Microsoft 365 Copilot, Azure AI, and Microsoft Foundry.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/ai-transformation-leader/',
        retirementDate: null,
        skillsMeasured: [
        'Evaluate AI opportunities and align investments with business goals (30–35%)',
        'Champion responsible AI practices (25–30%)',
        'Lead adoption, innovation, and change management (35–40%)'
        ],
      },
      {
        id: 'ab-100',
        examCode: 'AB-100',
        name: 'Agentic AI Solutions Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'builder',
        description: 'As an AI-first solution architect, you lead the transformation of enterprise operations by envisioning and implementing AI-powered architecture.',
        prerequisites: ['ab-410'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/',
        retirementDate: null,
        skillsMeasured: [
        'Expertise in architecting solutions that use AI, including generative AI and various Foundry Tools tailored to meet business objectives.',
        'The ability to design agentic-first solutions.',
        'Skills in designing multi-agent orchestrated solutions.',
        'Experience designing secure and scalable cross-platform AI solutions.',
        'Comprehensive knowledge of core Dynamics 365 products, Microsoft Power Platform, Microsoft Copilot Studio, Microsoft Foundry Tools, and Foundry Models.',
        'Proficiency in working with agents created by using Copilot Studio, AI prompts, Microsoft Foundry, and working knowledge of multiple language models to create intelligent solutions.',
        'Proficiency in adopting frameworks and delivering measurable outcomes aligned with enterprise success metrics and architecture patterns.',
        'Expertise in working with open standards and protocols, including Agent2Agent (A2A) and Model Context Protocol (MCP).',
        'Expertise in responsible AI practices, helping to ensure compliance and advocating for the Microsoft responsible AI guidelines.',
        'Strong leadership in orchestrating AI features in Microsoft business applications to optimize operations and unlock growth opportunities.',
        'Skills in securing AI models and data workflows, including detecting and resolving vulnerabilities, enforcing data residency and access controls, safeguarding model tuning, tracking changes, maintaining audit trails, and defending against prompt manipulation.',
        'Experience in monitoring agent performance and interpreting telemetry data to help ensure reliability, optimize behavior, and drive continuous improvement.',
        'Ability to conduct a return-on-investment (ROI) analysis of an AI-powered solution.'
        ],
      }
    ],
  },
  {
    id: 'dynamics-365',
    name: 'Microsoft Dynamics 365',
    shortName: 'Dynamics 365',
    code: 'MB',
    pillar: PILLARS.BIZ_SOLUTIONS,
    color: 'var(--line-dynamics)',
    glowColor: 'var(--glow-dynamics)',
    cssVar: '--line-dynamics',
    icon: 'Briefcase',
    description: 'Implement, customize, and maintain Dynamics 365 business applications.',
    branches: [
      { id: 'sales-service', name: 'Sales & Service' },
      { id: 'finance-ops', name: 'Finance & Operations' },
      { id: 'bc', name: 'Business Central' },
    ],
    certifications: [
      {
        id: 'mb-230',
        examCode: 'MB-230',
        name: 'Dynamics 365 Customer Service Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'sales-service',
        description: 'Build CX solutions that are fast, agile, and leverage AI.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-230/',
        retirementDate: null,
        skillsMeasured: [
        'Manage cases in Customer Service (51–55%)',
        'Configure representative experience and routing (25–30%)',
        'Extend Customer Service (15–20%)'
        ],
      },
      {
        id: 'mb-310',
        examCode: 'MB-310',
        name: 'Dynamics 365 Finance Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Analyze and translate financial business requirements into processes and solutions that implement industry recommended practices.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-310/',
        retirementDate: null,
        skillsMeasured: [
        'Implement financial management (40–45%)',
        'Implement accounts receivable, credit, collections, and subscription billing (15–20%)',
        'Implement and manage accounts payable and expenses (10–15%)',
        'Manage budgeting (10–15%)',
        'Manage fixed assets (10–15%)'
        ],
      },
      {
        id: 'mb-330',
        examCode: 'MB-330',
        name: 'Dynamics 365 Supply Chain Management Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Design and configure Dynamics 365 Supply chain Management and related tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-330/',
        retirementDate: '2026-12-31',
        skillsMeasured: [
        'Implement product information management (25–30%)',
        'Implement inventory and asset management (20–25%)',
        'Implement and manage supply chain processes (15–20%)',
        'Implement warehouse management and transportation management (20–25%)',
        'Implement master planning (10–15%)'
        ],
      },
      {
        id: 'mb-500',
        examCode: 'MB-500',
        name: 'Dynamics 365 Finance and Operations Apps Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'finance-ops',
        description: 'Implement and extend finance and operation apps in Microsoft Dynamics 365.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-500/',
        retirementDate: null,
        skillsMeasured: [
        'Plan the architecture and solution design (5–10%)',
        'Apply developer tools (5–10%)',
        'Design and develop AOT elements (15–20%)',
        'Develop and test code (20–25%)',
        'Implement reporting (10–15%)',
        'Integrate and manage data solutions (15–20%)',
        'Implement security and optimize performance (10–15%)'
        ],
      },
      {
        id: 'mb-800',
        examCode: 'MB-800',
        name: 'Dynamics 365 Business Central Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'bc',
        description: 'As a functional consultant, you implement core application setup processes for small and medium businesses. You configure the application in collaboration with the implementation team to provide the business with manageability and ease of use.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-800/',
        retirementDate: null,
        skillsMeasured: [
        'Set up Business Central (20–25%)',
        'Configure financials (30–35%)',
        'Configure sales and purchasing (10–15%)',
        'Perform Business Central operations (30–35%)'
        ],
      },
      {
        id: 'mb-820',
        examCode: 'MB-820',
        name: 'Dynamics 365 Business Central Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'bc',
        description: 'Demonstrate you have the skills to design, develop, test, and maintain solutions based on Dynamics 365 Business Central.',
        prerequisites: ['mb-800'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-820/',
        retirementDate: null,
        skillsMeasured: [
        'Describe Business Central (10–15%)',
        'Install, develop, and deploy for Business Central (10–15%)',
        'Develop by using AL objects (35–40%)',
        'Develop by using AL (15–20%)',
        'Work with development tools (10–15%)',
        'Integrate Business Central with other applications (10–15%)'
        ],
      },
    ],
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps',
    shortName: 'Azure DevOps',
    code: 'AZ',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-devops)',
    glowColor: 'var(--glow-devops)',
    cssVar: '--line-devops',
    icon: 'AzureDevOps',
    description: 'Design and implement DevOps practices for version control, compliance, CI/CD, and monitoring.',
    branches: [],
    certifications: [
      {
        id: 'az-900',
        examCode: 'AZ-900',
        name: 'Azure Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Demonstrate foundational knowledge of cloud concepts, core Azure services, plus Azure management and governance features and tools.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-900/',
        retirementDate: null,
        skillsMeasured: [
        'Describe cloud concepts (25–30%)',
        'Describe Azure architecture and services (35–40%)',
        'Describe Azure management and governance (30–35%)'
        ],
        isShared: true,
        sharedWith: 'azure-infrastructure',
      },
      {
        id: 'az-104',
        examCode: 'AZ-104',
        name: 'Azure Administrator Associate',
        level: CERT_LEVELS.ASSOCIATE,
        description: 'Demonstrate key skills to configure, manage, secure, and administer key professional functions in Microsoft Azure.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-104/',
        retirementDate: null,
        skillsMeasured: [
        'Manage Azure identities and governance (20–25%)',
        'Implement and manage storage (15–20%)',
        'Deploy and manage Azure compute resources (20–25%)',
        'Implement and manage virtual networking (15–20%)',
        'Monitor and maintain Azure resources (10–15%)'
        ],
        isShared: true,
        sharedWith: 'azure-infrastructure',
      },
      {
        id: 'az-400',
        examCode: 'AZ-400',
        name: 'DevOps Engineer Expert',
        level: CERT_LEVELS.EXPERT,
        description: 'Design and implement DevOps practices for version control, compliance, CI/CD, and monitoring.',
        prerequisites: [],
        recommendedPrereqs: ['az-104'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-400/',
        retirementDate: null,
        skillsMeasured: [
        'Design and implement processes and communications (10–15%)',
        'Design and implement a source control strategy (10–15%)',
        'Design and implement build and release pipelines (50–55%)',
        'Develop a security and compliance plan (10–15%)',
        'Implement an instrumentation strategy (5–10%)'
        ],
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    shortName: 'GitHub',
    code: 'GH',
    pillar: PILLARS.CLOUD_AI,
    color: 'var(--line-github)',
    glowColor: 'var(--glow-github)',
    cssVar: '--line-github',
    icon: 'GitHub',
    description: 'Automate software development workflows, pipeline optimization, and AI integrations with GitHub.',
    branches: [
      { id: 'devops', name: 'DevOps', description: 'Automate software development workflows and pipeline optimization' },
      { id: 'security', name: 'Security', description: 'Secure code, identify vulnerabilities, and manage security' },
      { id: 'ai', name: 'AI', description: 'AI-assisted development and agentic workflows' },
    ],
    certifications: [
      {
        id: 'gh-foundations',
        examCode: 'GH-900',
        name: 'GitHub Foundations',
        level: CERT_LEVELS.FUNDAMENTALS,
        description: 'Validates fundamental knowledge of Git, GitHub products, collaboration, and repository management.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-foundations/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of GH-900',
        'Implement and manage GH-900 workloads',
        'Optimize and monitor GH-900 environments',
        'Secure GH-900 solutions'
        ],
      },
      {
        id: 'gh-actions',
        examCode: 'GH-200',
        name: 'GitHub Actions',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'devops',
        description: 'Focuses on automating software development workflows, pipeline optimization, and task automation.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-actions/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Author and manage workflows (20–25%)',
        'Consume and troubleshoot workflows (15–20%)',
        'Author and maintain actions (15–20%)',
        'Manage GitHub Actions for the enterprise (20–25%)',
        'Secure and optimize automation (10–15%)'
        ],
      },
      {
        id: 'gh-security',
        examCode: 'GH-AdvancedSec',
        name: 'GitHub Advanced Security',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'security',
        description: 'Covers security implementation, vulnerability identification, and managing security within the development lifecycle.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-advanced-security/?practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Understand core concepts of GH-AdvancedSec',
        'Implement and manage GH-AdvancedSec workloads',
        'Optimize and monitor GH-AdvancedSec environments',
        'Secure GH-AdvancedSec solutions'
        ],
      },
      {
        id: 'gh-admin',
        examCode: 'GH-100',
        name: 'GitHub Administration',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'devops',
        description: 'Validates the ability to manage and optimize GitHub environments, including repository management and collaboration.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-administration/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Manage GitHub identities and access (15–20%)',
        'Administer GitHub Enterprise environment (10–15%)',
        'Implement secure software development and compliance (25–30%)',
        'Manage GitHub Actions (20–25%)',
        'Monitor and optimize GitHub usage (10–15%)'
        ],
      },
      {
        id: 'gh-copilot',
        examCode: 'GH-300',
        name: 'GitHub Copilot',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'ai',
        description: 'Focuses on using GitHub Copilot, covering prompt engineering, responsible AI, and integrating AI into development workflows.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/github-copilot/?WT.mc_id=certposter_poster_wwl&practice-assessment-type=certification',
        retirementDate: null,
        skillsMeasured: [
        'Use GitHub Copilot responsibly (15–20%)',
        'Use GitHub Copilot features (25–30%)',
        'GitHub Copilot features (25–30%)',
        'Understand GitHub Copilot data and architecture (10–15%)',
        'Apply prompt engineering and context crafting (10–15%)',
        'Improve developer productivity with GitHub Copilot (10–15%)',
        'Configure privacy, content exclusions, and safeguards (10–15%)'
        ],
      },
      {
        id: 'gh-600',
        examCode: 'GH-600',
        name: 'GitHub Agentic AI Developer',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'ai',
        description: 'Develop agentic workflows and advanced AI integrations on GitHub.',
        prerequisites: [],
        recommendedPrereqs: ['gh-foundations'],
        learnUrl: 'https://learn.microsoft.com/en-gb/credentials/certifications/agentic-ai-developer/?practice-assessment-type=certification',
        retirementDate: null,
        isBeta: true,
        skillsMeasured: [
        'Operating agent workflows inside the SDLC',
        'Supervising autonomous behavior with GitHub controls',
        'Evaluating and tuning agent outputs using scans and artifacts',
        'Configuring custom agents',
        'Coordinating multi-agent execution safely'
        ],
      }
    ],
  },
  {
    id: 'retired-exams',
    name: 'Retired Certifications',
    shortName: 'Retired Exams',
    code: 'ARCHIVE',
    pillar: PILLARS.RETIRED,
    color: 'var(--line-retired)',
    glowColor: 'var(--glow-retired)',
    cssVar: '--line-retired',
    icon: 'Archive',
    description: 'A collection of historically retired or soon-to-be retired certifications.',
    branches: [
      { id: 'retiring', name: 'Retiring Soon', isIndependent: true },
      { id: 'retired', name: 'Already Retired', isIndependent: true },
    ],
    certifications: [
      {
        id: 'pl-600',
        examCode: 'PL-600',
        name: 'Power Platform Solution Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'retired',
        description: 'Design and architect complex business solutions using the Power Platform.',
        prerequisites: ['pl-200'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-600/',
        retirementDate: '2026-06-30',
        skillsMeasured: [
        'Perform solution envisioning and requirement analysis (45–50%)',
        'Architect a solution (35–40%)',
        'Implement the solution (15–20%)'
        ],
        isIndependent: true,
      },
      {
        id: 'az-800',
        examCode: 'AZ-800/801',
        name: 'Windows Server Hybrid Admin Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Configure and manage Windows Server on-premises, hybrid, and IaaS workloads.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-800/',
        retirementDate: '2026-09-30',
        skillsMeasured: [
        'Understand core concepts of AZ-800/801',
        'Implement and manage AZ-800/801 workloads',
        'Optimize and monitor AZ-800/801 environments',
        'Secure AZ-800/801 solutions'
        ],
        isIndependent: true,
      },
      {
        id: 'az-204',
        examCode: 'AZ-204',
        name: 'Azure Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Build end-to-end solutions in Microsoft Azure to create Azure Functions, implement and manage web apps, develop solutions utilizing Azure storage, and more.',
        prerequisites: [],
        recommendedPrereqs: ['az-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-204/',
        retirementDate: '2026-07-31',
        skillsMeasured: [
        'Develop Azure compute solutions (25–30%)',
        'Develop for Azure storage (15–20%)',
        'Implement Azure security (15–20%)',
        'Monitor, troubleshoot, and optimize Azure solutions (5–10%)',
        'Connect to and consume Azure services and third-party services (20–25%)'
        ],
        isIndependent: true,
      },
      {
        id: 'pl-200',
        examCode: 'PL-200',
        name: 'Power Platform Functional Consultant Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retiring',
        description: 'Configure Dataverse, Power Apps, Power Automate, and chatbots for business solutions.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-200/',
        retirementDate: '2026-08-31',
        skillsMeasured: [
        'Configure Microsoft Dataverse (25–30%)',
        'Create apps by using Microsoft Power Apps (25–30%)',
        'Create and manage logic and process automation (25–30%)',
        'Manage environments (15–20%)'
        ],
        isIndependent: true,
      },
      {
        id: 'pl-500',
        examCode: 'PL-500',
        name: 'Power Automate RPA Developer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Demonstrate how to improve and automate workflows with Microsoft Power Automate RPA developer.',
        prerequisites: [],
        recommendedPrereqs: ['pl-900'],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/pl-500/',
        retirementDate: '2026-06-30',
        skillsMeasured: [
        'Design automations (25–30%)',
        'Develop automations (45–50%)',
        'Deploy and manage automations (20–25%)'
        ],
        isIndependent: true,
      },
      {
        id: 'ms-900',
        examCode: 'MS-900',
        name: 'Microsoft 365 Fundamentals',
        level: CERT_LEVELS.FUNDAMENTALS,
        branch: 'retired',
        description: 'Demonstrate understanding of Microsoft 365, to deliver industry-leading productivity apps along with intelligent cloud services, and world-class security.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ms-900/',
        retirementDate: '2026-03-31',
        skillsMeasured: [
        'Describe cloud concepts (5–10%)',
        'Describe Microsoft 365 apps and services (45–50%)',
        'Describe security, compliance, privacy, and trust in Microsoft 365 (25–30%)',
        'Describe Microsoft 365 pricing, licensing, and support (10–15%)'
        ],
        isIndependent: true,
      },
      {
        id: 'dp-100',
        examCode: 'DP-100',
        name: 'Azure Data Scientist Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Apply data science and machine learning to implement and run machine learning workloads on Azure.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-100/',
        retirementDate: '2026-06-30',
        skillsMeasured: [
        'Design and prepare a machine learning solution (20–25%)',
        'Explore data and train models (35–40%)',
        'Prepare a model for deployment (20–25%)',
        'Deploy and retrain a model (10–15%)'
        ],
        isIndependent: true,
      },
      {
        id: 'az-500',
        examCode: 'AZ-500',
        name: 'Azure Security Engineer Associate',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Implement security controls and threat protection, manage identity and access, and protect data, applications, and networks.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-500/',
        retirementDate: '2026-08-31',
        skillsMeasured: [
        'Manage identity and access (25–30%)',
        'Secure networking (20–25%)',
        'Secure compute, storage, and databases (20–25%)',
        'Manage security operations (25–30%)'
        ],
        isIndependent: true,
      },
      {
        id: 'mb-700',
        examCode: 'MB-700',
        name: 'Dynamics 365 Finance and Operations Apps Solution Architect Expert',
        level: CERT_LEVELS.EXPERT,
        branch: 'retired',
        description: 'Advise stakeholders and translate business requirements into secure, scalable, and reliable solutions.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/mb-700/',
        retirementDate: '2026-06-30',
        skillsMeasured: [
        'Architect solutions (25–30%)',
        'Define solution data and process patterns (25–30%)',
        'Plan implementations (25–30%)',
        'Manage implementations (15–20%)'
        ],
        isIndependent: true,
      },
      {
        id: 'sc-730',
        examCode: 'SC-730',
        name: 'Cybersecurity Business Professional',
        level: CERT_LEVELS.ASSOCIATE,
        branch: 'retired',
        description: 'Credential cancelled and withdrawn by Microsoft following beta evaluation.',
        prerequisites: [],
        learnUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/',
        retirementDate: '2026-06-30',
        skillsMeasured: [],
        isIndependent: true,
      }
    ]
  }
];

// Dynamically attach job roles to certifications based on careerRoles mapping
certificationPaths.forEach(path => {
  path.certifications.forEach(cert => {
    const matchedRoles = careerRoles
      .filter(role => role.certs.includes(cert.id))
      .map(role => ({ title: role.title, color: role.color, icon: role.icon }));
    
    if (matchedRoles.length > 0) {
      cert.role = matchedRoles[0].title; // Primary role string
      cert.roles = matchedRoles.map(r => r.title); // All matched role strings
      cert.roleData = matchedRoles; // Rich data including colors and icons
    }
  });
});

// Helper to get a path by ID
export const getPathById = (pathId) => certificationPaths.find((p) => p.id === pathId);

// Helper to get a certification by ID across all paths
export const getCertById = (certId) => {
  for (const path of certificationPaths) {
    const cert = path.certifications.find((c) => c.id === certId);
    if (cert) return { cert, path };
  }
  return null;
};

// Get all certifications flat
export const getAllCertifications = () =>
  certificationPaths.flatMap((path) =>
    path.certifications.map((cert) => ({ ...cert, pathId: path.id, pathName: path.name, pathColor: path.color }))
  );

// Helper to get certifications that require a specific certification
export const getCertificationsRequiring = (certId) => {
  return getAllCertifications().filter((c) => {
    if (!c.prerequisites) return false;
    return c.prerequisites.some((prereq) => {
      if (Array.isArray(prereq)) {
        return prereq.includes(certId);
      }
      return prereq === certId;
    });
  });
};


