// src/modules/master-data/org/data/orgMockData.ts

export type OrgNodeType = 'company' | 'branch' | 'department' | 'warehouse'

export type OrgNodeStatus = 'active' | 'inactive' | 'draft'

export type OrgNode = {
  id: string
  code: string
  name: string
  type: OrgNodeType
  typeText: string
  parentName?: string
  companyName: string
  status: OrgNodeStatus
  statusText: string
  updatedAt: string
  owner: string
}

export const orgNodes: OrgNode[] = [
  {
    id: 'org-001',
    code: 'COM-001',
    name: 'บริษัท ตัวอย่าง จำกัด',
    type: 'company',
    typeText: 'บริษัท',
    companyName: 'บริษัท ตัวอย่าง จำกัด',
    status: 'active',
    statusText: 'ใช้งาน',
    updatedAt: '20 ส.ค. 2569',
    owner: 'Admin',
  },
  {
    id: 'org-002',
    code: 'BR-BKK',
    name: 'สาขากรุงเทพฯ',
    type: 'branch',
    typeText: 'สาขา',
    parentName: 'บริษัท ตัวอย่าง จำกัด',
    companyName: 'บริษัท ตัวอย่าง จำกัด',
    status: 'active',
    statusText: 'ใช้งาน',
    updatedAt: '20 ส.ค. 2569',
    owner: 'Admin',
  },
  {
    id: 'org-003',
    code: 'DEP-IT',
    name: 'ฝ่ายเทคโนโลยีสารสนเทศ',
    type: 'department',
    typeText: 'แผนก',
    parentName: 'สาขากรุงเทพฯ',
    companyName: 'บริษัท ตัวอย่าง จำกัด',
    status: 'active',
    statusText: 'ใช้งาน',
    updatedAt: '19 ส.ค. 2569',
    owner: 'Admin',
  },
  {
    id: 'org-004',
    code: 'DEP-FIN',
    name: 'ฝ่ายบัญชีและการเงิน',
    type: 'department',
    typeText: 'แผนก',
    parentName: 'สาขากรุงเทพฯ',
    companyName: 'บริษัท ตัวอย่าง จำกัด',
    status: 'draft',
    statusText: 'รอตรวจสอบ',
    updatedAt: '18 ส.ค. 2569',
    owner: 'Admin',
  },
]