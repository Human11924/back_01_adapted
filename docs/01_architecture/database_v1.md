# AdaptEd Database V1

## Roles
- admin
- employee

## Organization
- id
- name
- industry
- created_at

## User
- id
- email
- password_hash
- role
- organization_id
- is_active
- created_at

## EmployeeProfile
- id
- user_id
- full_name
- position
- department
- cefr_level

## Course
- id
- title
- description
- level
- is_active

## Module
- id
- course_id
- title
- order_index

## Lesson
- id
- module_id
- title
- lesson_type
- order_index

## Enrollment
- id
- employee_id
- course_id
- assigned_at
- status

## LessonProgress
- id
- enrollment_id
- lesson_id
- status
- progress_percent
- completed_at