// Microsoft Product Icons
import { Icon } from '@iconify/react';
import azureSvg from '../../assets/icons/azure.svg';
import azureAiSvg from '../../assets/icons/azure-ai.svg';
import defenderSvg from '../../assets/icons/defender.svg';
import powerPlatformSvg from '../../assets/icons/power-platform.svg';
import copilotSvg from '../../assets/icons/copilot.svg';
import dynamicsSvg from '../../assets/icons/dynamics.svg';
import fabricSvg from '../../assets/icons/fabric.svg';
import dashboardSvg from '../../assets/icons/dashboard.svg';
import archiveSvg from '../../assets/icons/archive.svg';
import careerPathSvg from '../../assets/icons/career-path.svg';

// Base component for image-based icons
const ImageIcon = ({ src, alt, size = 20, className, style, ...props }) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={className}
    style={{ ...style, objectFit: 'contain' }}
    {...props}
  />
);

// Each icon accepts: size, color, className, style props

// ─── Azure Logo ───────────────────────────────────────────────────────────────
export const AzureIcon = (props) => <ImageIcon src={azureSvg} alt="Azure" {...props} />;

// ─── Azure AI & ML ────────────────────────────────────────────────────────────
export const AzureAIIcon = (props) => <ImageIcon src={azureAiSvg} alt="Azure AI & ML" {...props} />;

// ─── Data & Analytics ─────────────────────────────────────────────────────────
export const DataAnalyticsIcon = (props) => <ImageIcon src={fabricSvg} alt="Data & Analytics" {...props} />;

// ─── Security & Identity ──────────────────────────────────────────────────────
export const SecurityIcon = (props) => <ImageIcon src={defenderSvg} alt="Microsoft Defender" {...props} />;

// ─── Microsoft 365 ────────────────────────────────────────────────────────────
export const M365Icon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="logos:microsoft-icon"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── Power Platform ──────────────────────────────────────────────────────────
export const PowerPlatformIcon = (props) => <ImageIcon src={powerPlatformSvg} alt="Power Platform" {...props} />;

// ─── Copilot & AI ─────────────────────────────────────────────────────────────
export const CopilotIcon = (props) => <ImageIcon src={copilotSvg} alt="Copilot & AI" {...props} />;

// ─── Dynamics 365 ─────────────────────────────────────────────────────────────
export const DynamicsIcon = (props) => <ImageIcon src={dynamicsSvg} alt="Dynamics 365" {...props} />;

// ─── Azure DevOps ─────────────────────────────────────────────────────────────
export const AzureDevOpsIcon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="devicon:azuredevops"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── GitHub ──────────────────────────────────────────────────────────
export const GitHubIcon = ({ size = 20, color, className, style, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color || 'currentColor'}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    aria-hidden="true"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const DashboardIcon = (props) => <ImageIcon src={dashboardSvg} alt="Dashboard" {...props} />;

// ─── Retired / Archived ──────────────────────────────────────────────────────
export const ArchiveIcon = (props) => <ImageIcon src={archiveSvg} alt="Archive" {...props} />;

// ─── Career Path ──────────────────────────────────────────────────────────────
export const CareerPathIcon = (props) => <ImageIcon src={careerPathSvg} alt="Career Path" {...props} />;

// ─── Custom Career / Settings (Full Color) ──────────────────────────────────
export const SettingsColorIcon = ({ size = 20, className, style, ...props }) => (
  <Icon
    icon="fluent-color:settings-48"
    width={size}
    height={size}
    className={className}
    style={style}
    {...props}
  />
);

// ─── Applied Skills Badge Icon ──────────────────────────────────────────────
export const AppliedSkillsIcon = ({ size = 20, className, style, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="12" r="10.5" fill="#0078D4" />
    <path d="M12 5.5l1.6 4.9 4.9 1.6-4.9 1.6-1.6 4.9-1.6-4.9-4.9-1.6 4.9-1.6z" fill="#ffffff" />
    <circle cx="17.8" cy="6.8" r="1.2" fill="#ffffff" />
  </svg>
);

