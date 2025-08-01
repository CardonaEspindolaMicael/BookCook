``` mermaid
classDiagram
  class User {
    UUID id
    String name
    String email
    String image
    boolean isPremium
    Date createdAt
    Date updatedAt
  }

  class Wallet {
    UUID id
    UUID userId
    String address
    String type
    String network
    boolean isActive
    Date createdAt
  }

  class PaymentMethod {
    UUID id
    UUID userId
    String type
    String provider
    String details
    boolean isActive
    Date createdAt
  }

  class Book {
    UUID id
    String title
    String description
    float price
    String status
    Date createdAt
    Date updatedAt
    UUID authorId
  }

  class Role {
    UUID id
    String name
    String description
    String permissions
  }

  class UserRole {
    UUID id
    UUID userId
    UUID roleId
    Date assignedAt
    Date expiresAt
  }

  class Chapter {
    UUID id
    String title
    String content
    int orderIndex
    UUID bookId
    Date createdAt
    Date updatedAt
  }

  class Purchase {
    UUID id
    UUID buyerId
    UUID bookId
    float amount
    String status
    Date purchaseDate
  }

  class Payment {
    UUID id
    UUID purchaseId
    UUID userId
    float amount
    String paymentMethod
    String transactionHash
    String status
    Date timestamp
  }

  class AIAssistant {
    UUID id
    String model
    String type
    generateText(String prompt)
    correctContent(String content)
    suggestImprovements(String content)
    assistReader(String query)
  }

  class InteractionType {
    UUID id
    String name
    String description
    boolean isActive
    float costPerUse
    String category
    Date createdAt
  }

  class AIInteraction {
    UUID id
    UUID userId
    UUID bookId
    UUID chapterId
    UUID interactionTypeId
    String query
    String response
    Date timestamp
  }

  class BlockchainTransaction {
    UUID id
    String transactionHash
    UUID userId
    UUID resourceId
    String resourceType
    String network
    float amount
    String status
    Date timestamp
  }

  class BookVersion {
    UUID id
    UUID bookId
    String versionHash
    String changes
    Date createdAt
  }

  %% Enhanced Crowdfunding Models
  class Funding {
    UUID id
    UUID backerId
    UUID recipientId
    UUID campaignId
    UUID bookId
    float amount
    String message
    boolean isAnonymous
    String fundingType
    String status
    Date createdAt
  }

  class Campaign {
    UUID id
    UUID creatorId
    UUID bookId
    String title
    String description
    String campaignType
    float targetAmount
    float currentAmount
    String status
    Date startDate
    Date endDate
    Date createdAt
    Date updatedAt
  }

  class CampaignGoal {
    UUID id
    UUID campaignId
    UUID creatorId
    float amount
    String title
    String description
    String reward
    boolean isReached
    Date reachedAt
    Date createdAt
  }

  class FanRequest {
    UUID id
    UUID fanId
    UUID authorId
    UUID bookId
    String requestType
    String title
    String description
    float offerAmount
    String status
    int priority
    int upvotes
    Date createdAt
    Date updatedAt
  }

  class Subscription {
    UUID id
    UUID subscriberId
    UUID creatorId
    String tier
    float monthlyAmount
    String status
    String benefits
    Date startDate
    Date endDate
    Date createdAt
  }

  class ContentUpdate {
    UUID id
    UUID authorId
    UUID bookId
    UUID chapterId
    String title
    String content
    String updateType
    boolean isPublic
    String tierRequired
    Date publishedAt
    Date createdAt
  }

  class Backer {
    UUID id
    UUID userId
    UUID campaignId
    float totalContributed
    String backerTier
    boolean isAnonymous
    Date firstBackedAt
    Date lastBackedAt
  }

  %% User relationships
  User "1" --> "*" Wallet : owns
  User "1" --> "*" PaymentMethod : has
  User "1" --> "*" Book : creates
  User "1" --> "*" Purchase : makes
  User "1" --> "*" Payment : initiates
  User "1" --> "*" AIInteraction : interacts
  User "1" --> "*" BlockchainTransaction : performs

  %% Book relationships
  Book "1" --> "*" Chapter : contains
  Book "1" --> "*" Purchase : soldAs
  Book "1" --> "*" BookVersion : versioned
  Book "1" --> "*" AIInteraction : assisted

  %% Chapter relationships
  Chapter "1" --> "*" AIInteraction : enhanced

  %% Purchase and Payment relationships
  Purchase "1" --> "1..*" Payment : paidBy
  Payment --> PaymentMethod : uses
  Payment --> Wallet : fromWallet

  %% AI relationships
  AIAssistant "1" --> "*" AIInteraction : processes
  InteractionType "1" --> "*" AIInteraction : defines

  %% Blockchain relationships
  BlockchainTransaction --> Wallet : involves
  Payment "1" --> "0..1" BlockchainTransaction : recordedAs

  %% Role relationships (Many-to-many)
  User "1" --> "*" UserRole : assigned
  Role "1" --> "*" UserRole : assignedTo

  %% Version control
  Book "1" --> "*" BookVersion : tracked

  %% Enhanced Crowdfunding Relationships
  User "1" --> "*" Funding : backs
  User "1" --> "*" Funding : receives
  User "1" --> "*" Campaign : creates
  User "1" --> "*" CampaignGoal : sets
  User "1" --> "*" FanRequest : requests
  User "1" --> "*" FanRequest : receives
  User "1" --> "*" Subscription : subscribes
  User "1" --> "*" Subscription : offers
  User "1" --> "*" ContentUpdate : publishes
  User "1" --> "*" Backer : becomes

  Book "1" --> "*" Funding : funded_for
  Book "1" --> "*" Campaign : funded_by
  Book "0..1" --> "*" FanRequest : requested_for
  Book "1" --> "*" ContentUpdate : updates

  Campaign "1" --> "*" Funding : receives
  Campaign "1" --> "*" CampaignGoal : has_goals
  Campaign "1" --> "*" Backer : has_backers

  Chapter "1" --> "*" ContentUpdate : updates
```