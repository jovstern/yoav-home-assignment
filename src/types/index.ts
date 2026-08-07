export type Provider = 'AWS' | 'GCP' | 'Azure'
export type Environment = 'production' | 'staging' | 'development'
export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export interface Resource {
  id: string
  name: string
  type: string
  provider: Provider
  region: string
  environment: Environment
  criticality: Criticality
  owner: string
  tags: string[]
  /**
   * Not present in the spec's Resource interface, but required by the
   * "Display" requirement and shown on the spec's own sample resource —
   * added here to reconcile that inconsistency.
   */
  openIssues: number
}

export interface Application {
  id: string
  name: string
  description?: string
  resourceIds: string[]
  createdAt: number
}
