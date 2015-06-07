class UsersController < ApplicationController
  def index
  	@users = User.all.order("username")
  end

  def show
  	@user = User.friendly.find(params[:username])
  end
end
